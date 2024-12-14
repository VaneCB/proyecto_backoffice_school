<?php

namespace Deployer;

require 'recipe/laravel.php';
require 'contrib/rsync.php';
require 'contrib/npm.php';

$projectName = 'persuasion';

set('repository', 'git@github.com:diaple/erppersuasion.git');

set('rsync_src', __DIR__);

set('rsync',[
    'exclude'      => [
        '.git',
        'deploy.php',
        'node_modules',
        'storage',
        'tests',
        'vendor',
        '.github',
        '.vscode',
        '.idea',
        'composer.lock',
    ],
    'exclude-file' => false,
    'include'      => [],
    'include-file' => false,
    'filter'       => [],
    'filter-file'  => false,
    'filter-perdir'=> false,
    'flags'        => 'rz', // Recursive, with compress
    'options'      => ['delete'],
    'timeout'      => 60,
]);

$users = [ 'roberto', 'irene', 'vanessa' ];

foreach ($users as $user) {
    host("{$projectName}_{$user}.dev.diaple.com")
        ->setRemoteUser('deployer')
        ->set('deploy_path', "/var/www/vhosts/{$user}/{$projectName}")
        ->set('rsync_dest', "/var/www/vhosts/{$user}/{$projectName}/current")
        ->set('release_path', "/var/www/vhosts/{$user}/{$projectName}/current")
        ->setLabels([
            'user' => $user,
            'env' => 'dev',
        ]);
}

host('persuasion.diaple.com')
    ->set('remote_user', 'persuasion')
    ->set('deploy_path', '/var/www/diaple.com/persuasion')
    ->set('branch', 'develop')
    ->setLabels([
        'env' => 'prod',
        'type' => 'deploy'
    ]);

task('deploy_dev', [
    'rsync',
    'deploy:shared',
    'deploy:writable',
    'deploy:vendors',
    'artisan:migrate',
    'deploy:success'
])->select('env=dev');

task('sync_dev', [
    'rsync',
    'artisan:migrate',
    'deploy:success'
])->select('env=dev');

after('deploy:vendors', 'npm:install');

task('artisan:view:cache', function () {});
