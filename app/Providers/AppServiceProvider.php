<?php

namespace App\Providers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Validator::extend('custom_file_type', function ($attribute, $value, $parameters, $validator) {
            if ($value instanceof \Illuminate\Http\UploadedFile) {
                $allowedTypes = ['pdf', 'jpg', 'jpeg', 'doc', 'docx'];

                $extension = strtolower($value->getClientOriginalExtension());

                return in_array($extension, $allowedTypes);
            }

            return true;
        });


    }
}
