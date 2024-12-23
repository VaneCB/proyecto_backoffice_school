<div class="row">
    <div class="col-2">
        <label for="student.name" class="form-control-label">Estudiantes</label>
        <select class="form-control" wire:model="selectedStudent">
            <option value="0">Selecciona un estudiante</option>
            @foreach($this->students as $student)
                <option value="{{ $student->id }}">{{ $student->name }} {{ $student->surname1 }}</option>
            @endforeach
        </select>
        @error('student')
        <div class="text-danger">{{ $message }}</div>
        @enderror
    </div>
    <div class="col-4 p-2 align-content-lg-end">
        <br>
        <button type="button" class="btn bg-gradient-secondary"
                data-bs-toggle="tooltip" data-bs-placement="right" id="addStudentButton"
                wire:click="addStudent">
            + Inscribir
        </button>
    </div>
</div>

<div class="table-responsive p-0">
    <table class="table align-items-center mb-0">
        <thead>
        <tr>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                Nombre
            </th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                Apellidos
            </th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                Email
            </th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                Curso
            </th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                Acciones
            </th>
        </tr>

        </thead>
        @foreach($acceptedStudents as $student)
            <tbody>
            <tr>
                <td>
                    <p class="text-xs font-weight-bold mb-0">{{ $student->student->name }}</p>
                </td>
                <td>
                    <p class="text-xs font-weight-bold mb-0">{{ $student->student->surname1 }}</p>
                </td>
                <td>
                    <p class="text-xs font-weight-bold mb-0">{{ $student->student->email }}</p>
                </td>
                <td>
                    <p class="text-xs font-weight-bold mb-0">{{ $student->student->course }}</p>
                </td>
                <td>
                    <a href="{{ route('student.show', $student->student->id) }}" class="btn bg-gradient-info">
                        <i class="fas fa-eye"></i>
                    </a>
                    <button type="button"
                            class="btn btn-xs bg-gradient-secondary"
                            data-bs-toggle="modal"
                            data-bs-target="#deleteStudentModal_{{$student->student->id}}">
                        <li class="far fa-trash-alt"></li>
                    </button>
                </td>
                <!-- Modal -->
                <div class="modal fade" id="deleteStudentModal_{{$student->student->id}}"
                     tabindex="-1" role="dialog"
                     aria-labelledby="deleteStudentModalLabel"
                     aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered"
                         role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title"
                                    id="studentModalLabel">
                                   Quitar inscripción</h5>
                                <button type="button"
                                        class="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <p>¿Está seguro que quiere
                                    quitar la inscripción a este alumno?</p>
                                <br>
                                <h4 class="subh4">{{$student->student->name}}
                                    {{$student->student->surname1}}</h4>
                            </div>
                            <div class="modal-footer">
                                <button type="button"
                                        class="btn bg-gradient-secondary"
                                        data-bs-dismiss="modal">
                                    Cancelar
                                </button>
                                <a type="button"
                                   wire:click="deleteStudent({{$student->student->id}})"
                                   class="btn bg-gradient-dark" data-bs-dismiss="modal">Eliminar</a>
                            </div>
                        </div>
                    </div>
                </div>
            </tr>
            </tbody>
        @endforeach
    </table>
</div>
