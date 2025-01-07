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
        $this->showAddButton = false;
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

            // Obtener las actividades extracurriculares del profesor
            $activityIds = $this->getExtracurricularActivityId($teacherId);

            if (!$activityIds) {
                return Student::query()->whereRaw('1 = 0');
            }

            // Obtener los estudiantes que están inscritos en las actividades del profesor
            return Student::query()
                ->whereIn('students.id', function($query) use ($activityIds) {
                    $query->select('sr.student_id')
                        ->from('student_registrations as sr')
                        ->where('sr.status', 1)
                        ->whereIn('sr.extracurricular_activity_id', $activityIds);
                })
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
        // Obtener todas las actividades que corresponden al profesor
        $activities = ExtracurricularActivity::where('teacher_id', $teacherId)->pluck('id')->toArray();

        // Si no hay actividades, devolver un array vacío
        return $activities;
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
        if (auth()->user()->hasRole('teacher')) {
            session()->flash('error', 'No tienes permisos para eliminar estudiantes.');
            return;
        }

        // Eliminar el registro si es admin
        Student::destroy($recordId);
        session()->flash('message', 'Estudiante eliminado correctamente.');
    }

}
