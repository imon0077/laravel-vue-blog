<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\AdminCheck;

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

Route::prefix('app')->middleware([AdminCheck::class])->group(function(){
    //Tags
    Route::post('/create_tag', 'TagController@addTag');
    Route::get('/get_tags', 'TagController@getTag');
    Route::post('/edit_tag', 'TagController@editTag');
    Route::post('/delete_tag', 'TagController@deleteTag');

    //category
    Route::post('/upload', 'TagController@upload');
    Route::post('/delete_image', 'TagController@deleteImage');
    Route::post('/create_category', 'TagController@addCategory');
    Route::get('/get_category', 'TagController@getCategory');
    Route::post('/edit_category', 'TagController@editCategory');
    Route::post('/delete_category', 'TagController@deleteCategory');

    //Admin user
    Route::post('/create_user', 'TagController@createUser');
    Route::get('/get_users', 'TagController@getUsers');
    Route::post('/edit_user', 'TagController@editUser');

    //Roles
    Route::post('/create_role', 'RoleController@store');
    Route::get('/get_roles', 'RoleController@index');
    Route::post('/edit_role', 'RoleController@update');
    Route::post('/delete_role', 'RoleController@destroy');

    Route::post('/assign-role', 'RoleController@assignRole');

    //login 
    Route::post('/admin_login', 'TagController@adminLogin');
});


Route::get('/logout', 'TagController@logout');
Route::get('/', 'TagController@index');
Route::any('{slug}', 'TagController@index');



// Route::get('/', function () {
//     return view('welcome');
// });

// Route::any('{slug}', function(){
//     return view('welcome');
// });


