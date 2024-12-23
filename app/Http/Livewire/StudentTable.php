<?php

namespace App\Http\Livewire;

use App\Models\ExtracurricularActivity;
use App\Models\Student;
use App\Models\Teacher;
use App\Table\Column;
use Livewire\WithPagination;

class StudentTable extends Table
{
    use WithPagination;
    public function __construct()
    {
        $this->addRoute = 'student.create';
        $this->actionCol[] = ['Ver', 'fas fa-eye', 'student.show'];
        $this->actionCol[] = ['Editar', 'fas fa-edit', 'student.edit'];
        $this->actionColDelete[] = ['Borrar', 'far fa-trash-alt', 'student.delete'];
        $this->idCheckbox = false;
        $this->showFilters = true;
        $this->showOrders = true;
        $this->sortBy ='surname1';
        $this->filters = [
            'name' => '',
            'surname1' => '',
            'surname2' => '',
            'course' => ''
        ];
    }
    public function query(): \Illuminate\Database\Eloquent\Builder
    {
        // TODO: Implement query() method.
        //return Student::query()->orderBy('surname1', 'asc', 'surname2', 'asc', 'name', 'asc');

        $user = auth()->user();

        if ($user->hasRole('admin')) {
            return Student::query()->orderBy('surname1', 'asc')
                ->orderBy('surname2', 'asc')
                ->orderBy('name', 'asc');
        }

        if ($user->hasRole('teacher')) {
            $teacherId = $this->getTeacherIdFromEmail($user->email);

            if (!$teacherId) {
                return Student::query()->whereRaw('1 = 0');
            }

            $activityId = $this->getExtracurricularActivityId($teacherId);

            if (!$activityId) {
                return Student::query()->whereRaw('1 = 0');
            }

            return Student::query()
                ->join('student_registrations as sr', 'students.id', '=', 'sr.student_id')
                ->where('sr.status', 1) // Solo estudiantes activos
                ->where('sr.extracurricular_activity_id', $activityId) // Validar que el estudiante esté en la actividad del profesor
                ->orderBy('surname1', 'asc')
                ->orderBy('surname2', 'asc')
                ->orderBy('name', 'asc');
        }

        return Student::query()->whereRaw('1 = 0');
    }

    protected function getTeacherIdFromEmail($email)
    {
        $teacher = Teacher::where('email', $email)->first();
        return $teacher ? $teacher->id : null;
    }

    /**
     * Obtiene las IDs de las actividades extracurriculares asignadas a un profesor.
     *
     * @param int $teacherId
     * @return array
     */
    protected function getExtracurricularActivityId($teacherId)
    {
        $activity = ExtracurricularActivity::where('teacher_id', $teacherId)->first();
        return $activity ? $activity->id : null;
    }


    public function columns(): array
    {
        return [
            Column::make('name', 'Nombre', 'text'),
            Column::make('surname1', 'Primer apellido', 'text'),
            Column::make('surname2', 'Segundo apellido', 'text'),
            Column::make('email', 'Email', 'text'),
            Column::make('course', 'Curso', 'text'),
        ];
    }
    public function deleteRecord($recordId)
    {
        Student::destroy($recordId);
    }
}
