<?php

use App\Http\Livewire\CapabilityTable;
use App\Http\Livewire\Capability\CapabilityEdit;
use App\Http\Livewire\Capability\CapabilityShow;
use App\Http\Livewire\Customer\CustomerDelete;
use App\Http\Livewire\Customer\CustomerEdit;
use App\Http\Livewire\Customer\CustomerShow;
use App\Http\Livewire\StudentRegistrations\StudentRegistrationEdit;
use App\Http\Livewire\StudentRegistrations\StudentRegistrationShow;
use App\Http\Livewire\EstimationsTable;
use App\Http\Livewire\ExtracurricularActivityTable;
use App\Http\Livewire\ExtracurricularActivity\ExtracurricularActivityEdit;
use App\Http\Livewire\EventsTable;
use App\Http\Livewire\ExtracurricularActivity\ExtracurricularActivityShow;
use App\Http\Livewire\ExtracurricularGroups\ExtracurricularGroupEdit;
use App\Http\Livewire\ExtracurricularGroups\ExtracurricularGroupShow;
use App\Http\Livewire\ExtracurricularGroupsTable;
use App\Http\Livewire\Language\LanguageEdit;
use App\Http\Livewire\Language\LanguageShow;
use App\Http\Livewire\LanguagesTable;
use App\Http\Livewire\Order\OrderEdit;
use App\Http\Livewire\Order\OrderShow;
use App\Http\Livewire\StudentRegistrationsTable;
use App\Http\Livewire\Student\StudentShow;
use App\Http\Livewire\Products\ProductDelete;
use App\Http\Livewire\CustomerTable;
use App\Http\Livewire\Student\StudentDelete;
use App\Http\Livewire\Student\StudentEdit;
use App\Http\Livewire\StudentTable;
use App\Http\Livewire\Products\ProductEdit;
use App\Http\Livewire\Products\ProductShow;
use App\Http\Livewire\ProductsTable;
use App\Http\Livewire\Materials\MaterialEdit;
use App\Http\Livewire\Materials\MaterialShow;
use App\Http\Livewire\MaterialsTable;
use App\Http\Livewire\Rates\RateEdit;
use App\Http\Livewire\Rates\RateShow;
use App\Http\Livewire\RatesTable;
use App\Http\Livewire\StudiesTable;
use App\Http\Livewire\Studies\StudyEdit;
use App\Http\Livewire\Studies\StudyShow;
use App\Http\Livewire\Users\UserDelete;
use App\Http\Livewire\UserTable;
use App\Http\Livewire\Teachers\WarehouseDelete;
use App\Http\Livewire\Teachers\TeacherEdit;
use App\Http\Livewire\Teachers\TeacherShow;
use App\Http\Livewire\TeachersTable;
use App\Models\ExtracurricularActivity;
use App\Models\Material;
use App\Models\StudentRegistration;
use Illuminate\Support\Facades\Route;
use App\Http\Livewire\Auth\ForgotPassword;
use App\Http\Livewire\Auth\ResetPassword;
use App\Http\Livewire\Auth\SignUp;
use App\Http\Livewire\Auth\Login;
use App\Http\Livewire\Dashboard;
use App\Http\Livewire\Billing;
use App\Http\Livewire\Profile;
use App\Http\Livewire\Tables;
use App\Http\Livewire\StaticSignIn;
use App\Http\Livewire\StaticSignUp;
use App\Http\Livewire\Rtl;
use App\Http\Livewire\Users\UserEdit;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('/login');
});

Route::get('/sign-up', SignUp::class)->name('sign-up');
Route::get('/login', Login::class)->name('login');

Route::get('/login/forgot-password', ForgotPassword::class)->name('forgot-password');

Route::get('/reset-password/{id}', ResetPassword::class)->name('reset-password')
    ->middleware('signed');

Route::get('/student_registrations/create', StudentRegistrationEdit::class)
    ->name('student_registrations.create');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', Dashboard::class)->name('dashboard');
    Route::get('/profile', Profile::class)->name('profile');
    Route::get('/tables', Tables::class)->name('tables');

    //STUDENTS
    Route::group(['prefix' => '/student', 'namespace' => 'App\Http\Livewire\Student', 'as' => 'student.'], function () {
        Route::get('/', StudentTable::class)->name('index');
        Route::get('/create', StudentEdit::class)->name('create');
        Route::get('/{id}-edit', StudentEdit::class)->name('edit');
        Route::delete('/{id}', StudentDelete::class)->name('delete');
        Route::get('/{id}',  StudentShow::class)->name('show');
    });

    //STUDENT REGISTRATIONS
    Route::group(['prefix' => '/student_registrations', 'namespace' => 'App\Http\Livewire\StudentRegistrations', 'as' => 'student_registrations.'], function () {
        Route::get('/', StudentRegistrationsTable::class)->name('index');
        Route::get('/{id}',  StudentRegistrationShow::class)->name('show');
    });

    //EXTRACURRICULAR ACTIVITIES
    Route::group(['prefix' => 'extracurricular_activities', 'namespace' => 'App\Http\Livewire\ExtracurricularActivity', 'as' => 'extracurricular_activities.'], function () {
        Route::get('/', ExtracurricularActivityTable::class)->name('index');
        Route::get('/create', ExtracurricularActivityEdit::class)->name('create');
        Route::get('/{id}-edit', ExtracurricularActivityEdit::class)->name('edit');
        Route::get('/{id}', ExtracurricularActivityShow::class)->name('show');
    });

    //TEACHERS
    Route::group(['prefix' => '/teachers', 'namespace' => 'App\Http\Livewire\Teachers', 'as' => 'teachers.'], function () {
        Route::get('/', TeachersTable::class)->name('index');
        Route::get('/create', TeacherEdit::class)->name('create');
        Route::get('/{id}-edit', TeacherEdit::class)->name('edit');
        Route::get('/{id}',  TeacherShow::class)->name('show');
    });

    //USUARIOS
    Route::group(['prefix' => '/users', 'namespace' => 'App\Http\Livewire\User', 'as' => 'users.'], function () {
        Route::get('/', UserTable::class)->name('index');
        Route::get('/{id}', UserEdit::class)->name('edit');
        Route::get('/create', UserEdit::class)->name('create');
        Route::delete('/{id}', UserDelete::class)->name('delete');
    });

    //MATERIALS
    Route::group(['prefix' => '/materials', 'namespace' => 'App\Http\Livewire\Materials', 'as' => 'materials.'], function () {
        Route::get('/', MaterialsTable::class)->name('index');
        Route::get('/create', MaterialEdit::class)->name('create');
        Route::get('/{id}-edit', MaterialEdit::class)->name('edit');
        Route::get('/{id}',  MaterialShow::class)->name('show');
    });


    //RATES
    Route::group(['prefix' => '/rates', 'namespace' => 'App\Http\Livewire\Rates', 'as' => 'rates.'], function () {
        Route::get('/', RatesTable::class)->name('index');
        Route::get('/create', RateEdit::class)->name('create');
        Route::get('/{id}-edit', RateEdit::class)->name('edit');;
        Route::get('/{id}',  RateShow::class)->name('show');
    });

    //CAPABILITIES
    Route::group(['prefix' => '/capabilities', 'namespace' => 'App\Http\Livewire\Capability', 'as' => 'capabilities.'], function () {
        Route::get('/', CapabilityTable::class)->name('index');
        Route::get('/create', CapabilityEdit::class)->name('create');
        Route::get('/{id}-edit', CapabilityEdit::class)->name('edit');
        Route::get('/{id}',  CapabilityShow::class)->name('show');
    });

    Route::get('/static-sign-in', StaticSignIn::class)->name('sign-in');
    Route::get('/static-sign-up', StaticSignUp::class)->name('static-sign-up');
    Route::get('/rtl', Rtl::class)->name('rtl');
});

