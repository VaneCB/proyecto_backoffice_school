<?php

namespace App\Http\Livewire\ExtracurricularActivity;

use App\Models\ExtracurricularActivity;
use App\Models\Material;
use App\Models\Rate;
use App\Models\Student;
use App\Models\StudentRegistration;
use App\Models\Teacher;
use Illuminate\Support\Facades\Log;
use Livewire\Component;

class ExtracurricularActivityShow extends Component
{
    public $activity;
    public $isOpen = false;
    public $acceptedStudents;
    public $selectedStudent;
    public $students;

    protected $listeners = [ 'showModal' => 'open', 'studentAdded', 'studentDeleted'];

    public function mount($id)
    {
        $this->activity = ExtracurricularActivity::find($id);
        $this->acceptedStudents = StudentRegistration::where('extracurricular_activity_id', $id)
            ->where('status', 1)
            ->with('student') // Relación con el modelo Student
            ->get();
        $this->teacher = Teacher::all();
        $this->material = Material::all();
        $this->rate = Rate::all();
        $this->students = Student::whereDoesntHave('registrations', function ($query) use ($id) {
            $query->where('extracurricular_activity_id', $id); // Sin registro en esta actividad
        })->orWhereHas('registrations', function ($query) use ($id) {
            $query->where('extracurricular_activity_id', $id)
                ->where('status', 2); // Registro cancelado para esta actividad
        })->get();
    }

    protected function show($id)
    {
        $this->activity = ExtracurricularActivity::find($id);

    }

    public function addStudent()
    {
        if (!$this->selectedStudent || $this->selectedStudent == 0) {
            session()->flash('error', 'Debes seleccionar un estudiante.');
            return;
        }

        // Crear el registro en student_registrations
        StudentRegistration::create([
            'student_id' => $this->selectedStudent,
            'extracurricular_activity_id' => $this->activity->id,
            'status' => 1,
        ]);

        // Actualizar lista de estudiantes no inscritos
        $this->students = Student::whereDoesntHave('registrations', function ($query) {
            $query->where('extracurricular_activity_id', $this->activity->id);
        })->get();

        session()->flash('success', 'Estudiante inscrito con éxito.');
        $this->selectedStudent = 0; // Resetear el valor seleccionado
        $this->emit('studentAdded');
    }

    public function deleteStudent($id)
    {
        // Cambiar el estado del registro a 2 (eliminado/suspendido)
        StudentRegistration::where('student_id', $id)
            ->where('extracurricular_activity_id', $this->activity->id)
            ->update(['status' => 2]);

        $this->studentAdded();
        $this->emit('studentAdded');
    }

    public function studentAdded()
    {
        $this->acceptedStudents = StudentRegistration::where('extracurricular_activity_id', $this->activity->id)
            ->where('status', 1)
            ->with('student')
            ->get();
    }

    public function returnMaterial()
    {
        // Verificar si hay material asignado
        if ($this->activity->material) {
            // Obtener el material actual
            $material = $this->activity->material;

            // Aumentar el stock del material en 1
            $material->stock += 1;
            $material->save();

            // Establecer material_id como null en la actividad
            $this->activity->material_id = null;
            $this->activity->save();

            // Emitir un mensaje de éxito
            session()->flash('success', 'El material ha sido devuelto correctamente y el stock ha sido actualizado.');

            // Actualizar la actividad en la vista
            $this->activity = $this->activity->fresh();  // Obtener la actividad actualizada
        } else {
            session()->flash('error', 'No hay material asignado para devolver.');
        }
    }

    public function render()
    {
        return view('livewire.extracurricular_activity.extracurricular_activity-show', [
            'activity' => $this->activity, 'open' => $this->isOpen, 'acceptedStudents' => $this->acceptedStudents, 'selectedStudent' => $this->selectedStudent
        ]);
    }
}
