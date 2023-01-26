<?php

/**
 * Backend rendered routes
 */
Route::get('pdf/call-sheets/{callSheetId}', 'PDFController@callSheet');

Route::get('rolecalls/{id}', 'PublicReqProfileController@index');

Route::get('profiles/{id}', 'PublicSpecProfileController@index');

Route::get('u/{id}/profiles', 'PublicSpecProfileListController@index');

/**
 * Redirectors
 */

Route::get('plans/talent', function() {
    return redirect('/', 301);
});
Route::get('plans/casting',function() {
    return redirect('/login', 301);
});
Route::get('faq', function() {
    return redirect('/', 301);
});
Route::get('talent-signup', function() {
    return redirect('/', 301);
});
Route::get('casting-signup', function() {
    return redirect('/', 301);
});

Route::get('public-req-profiles/{id}', function($id) {
    return redirect('rolecalls/'.$id, 301);
});

Route::get('preview-req-profiles/{id}', function($id) {
    return redirect('rolecalls/'.$id, 301);
});

Route::get('public-spec-profiles/{id}', function($id) {
    return redirect('profiles/'.$id, 301);
});

Route::get('preview-spec-profiles/{id}', function($id) {
    return redirect('profiles/'.$id, 301);
});


/**
 * Catch all routes and pass them to the SPA
 */
Route::get('/{catchall?}', function () {
    return view('index');
})->where('catchall', '.*');

Auth::routes();

/**
 * AWS Cron integration with laravel Scheduler
 */
Route::post('artisan-scheduler', function() {
    if (\Illuminate\Support\Facades\App::environment() == 'worker') {
        \Illuminate\Support\Facades\Artisan::call('schedule:run');
        return response(null);
    } else {
        return response("You don't have permission to access.", 401);
    }
});


