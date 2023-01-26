<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:api')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::get('ws-config',function () {
    return config('websockets.ws_config');
});

Route::post('login', 'Api\AuthController@login');

Route::post('password/email', 'Api\Auth\ForgotPasswordController@sendResetLinkEmail');
Route::post('password/reset', 'Api\Auth\ResetPasswordController@reset');

Route::post('users', 'Api\AuthController@store');

Route::get('files/{filePath}', 'Api\FileController@get')->where('filePath', '(.*)');

Route::resource('casting-directors', 'Api\CastingDirectorController', ['except' => [
    'create', 'edit'
]]);

Route::resource('talents', 'Api\TalentController', ['except' => [
    'create', 'edit'
]]);

Route::resource('spec-profiles', 'Api\SpecProfileController', ['except' => [
    'create', 'edit'
]])->middleWare('setLastActive');

Route::resource('attribute-groups', 'Api\AttributeGroupController', ['except' => [
    'create', 'edit'
]]);


Route::get('requirement-sheets/{requirementSheetId}/attributes', 'Api\AttributeRequirementController@index');
Route::get('rolecalls/values', 'Api\RoleCallAttributeValueController@index');
Route::get('rolecall-types', 'Api\RoleCallTypeController@index');
Route::get('attribute-definitions', 'Api\AttributeDefinitionController@index');

Route::post('spec-profiles/{specProfileId}/attributes', 'Api\AttributeController@store')->middleWare('setLastActive');
Route::put('spec-profiles/{specProfileId}/attributes/{attributeId}', 'Api\AttributeController@update')->middleWare('setLastActive');
Route::delete('spec-profiles/{specProfileId}/attributes/{attributeId}', 'Api\AttributeController@destroy')->middleWare('setLastActive');

Route::post('req-profiles/{reqProfileId}/attributes', 'Api\AttributeRequirementController@store')->middleWare('setLastActive');
Route::put('req-profiles/{reqProfileId}/attributes/{attributeRequirementId}', 'Api\AttributeRequirementController@update')->middleWare('setLastActive');
Route::delete('req-profiles/{reqProfileId}/attributes/{attributeRequirementId}', 'Api\AttributeRequirementController@destroy')->middleWare('setLastActive');

Route::get('rolecalls/{rolecallId}/talents', 'Api\RoleCallTalentController@index');
Route::get('rolecalls/{rolecallId}/talents/count', 'Api\RoleCallTalentController@count');
Route::get('talents/{talentId}/rolecalls/count','Api\TalentRoleCallController@count');
Route::get('rolecall-talents/{id}','Api\RoleCallTalentController@show');


Route::get('req-profiles/{reqProfileId}/matchings', 'Api\ReqProfileMatchingController@index');
Route::get('req-profiles/{reqProfileId}/matchings/count', 'Api\ReqProfileMatchingController@count');
Route::get('req-profiles/{id}', 'Api\ReqProfileController@show')->middleWare('setLastActive');

Route::get('spec-profiles/{specProfileId}/matchings', 'Api\SpecProfileMatchingController@index');
Route::get('spec-profiles/{specProfileId}/matchings/count', 'Api\SpecProfileMatchingController@count');

Route::get('profile-matchings/previous', 'Api\ProfileMatchingController@getProfileMatchingPrevious');
Route::get('profile-matchings/count','Api\ProfileMatchingController@countAll');
Route::get('profile-matchings/{id}', 'Api\ProfileMatchingController@show');
Route::put('profile-matchings/{id}', 'Api\ProfileMatchingController@update')->middleWare('setLastActive');
Route::post('profile-matchings/{id}/chat', 'Api\ProfileMatchingController@createChat')->middleWare('setLastActive');
Route::apiResource('profile-matchings','Api\ProfileMatchingController');
Route::apiResource('profile-matchings.comments', 'Api\Matching\MatchingCommentController')->middleWare('setLastActive');
Route::apiResource('profile-matchings.favorites', 'Api\Matching\MatchingFavoriteController')->middleWare('setLastActive');

Route::apiResource('blacklisted-profiles', 'Api\BlackListProfileController')->middleWare('setLastActive');
Route::apiResource('favorite-profiles', 'Api\FavoriteProfileController')->middleWare('setLastActive');

Route::get('spec-profiles/{specProfileId}/educations', 'Api\SpecProfiles\EducationController@index');
Route::get('spec-profiles/{specProfileId}/credits', 'Api\SpecProfiles\CreditController@index');

Route::get('categories/{categoryId}/functionalities', 'Api\Category\FunctionalityController@index');

/**
 * TODO: move to auth after testing
 */
Route::resource('req-profiles.matchings', 'Api\ReqProfileMatchingController', ['except' => [
    'create', 'edit', 'index'
]])->middleWare('setLastActive');
Route::resource('spec-profiles.matchings', 'Api\SpecProfileMatchingController', ['except' => [
    'create', 'edit', 'index'
]])->middleWare('setLastActive');


Route::post('subscribers', 'Api\SubscriberController@create');
Route::get('subscribers', 'Api\SubscriberController@index');

Route::put('users/{id}', 'Api\UserController@update');

Route::get('projects/{id}/call-sheets/{callSheetId}', 'Api\CallSheetController@show');

Route::get('calendars/{id}/events', 'Api\Calendar\CalendarEventController@index');

Route::middleware(['auth', 'setLastActive'])->group(function () {
    Route::post('logout', 'Api\AuthController@logout');

    Route::post('password', 'Api\AuthController@changePassword');

    Route::resource('projects', 'Api\ProjectController', ['except' => [
        'create', 'edit'
    ]]);

    Route::get('projects/{id}', 'Api\ProjectController@show');

    Route::get('role-setting/{code}', 'Api\RoleSettingController@can');

    Route::resource('categories', 'Api\CategoryController', ['except' => [
        'create', 'edit'
    ]]);

    Route::resource('categories.subcategories', 'Api\SubCategoryController', ['except' => [
        'create', 'edit'
    ]]);

    Route::resource('attribute-definitions', 'Api\AttributeDefinitionController', ['except' => [
        'create', 'edit', 'index'
    ]]);

    Route::get('rolecalls/count','Api\RoleCallController@count');

    Route::post('rolecalls/rolecall-talents-check', 'Api\RoleCallController@checkNewRolecallTalents');

    Route::get('talents/values', 'Api\RoleCallAttributeValueController@index');

    Route::resource('rolecalls', 'Api\RoleCallController', ['except' => [
        'create', 'edit'
    ]]);

    Route::resource('req-profiles', 'Api\ReqProfileController', ['except' => [
        'create', 'edit'
    ]]);

    Route::resource('rolecall-types', 'Api\RoleCallTypeController', ['except' => [
        'create', 'edit', 'index'
    ]]);

    Route::resource('project-types', 'Api\ProjectTypeController', ['except' => [
        'create', 'edit'
    ]]);

    Route::resource('acceptable-payment-types', 'Api\AcceptablePaymentController', ['except' => [
        'create', 'edit'
    ]]);



    Route::get('notifications','Api\NotificationController@index');

    Route::get('notifications/count','Api\NotificationController@count');

    Route::put('notifications/{id}', 'Api\NotificationController@update');

    Route::put('notifications', 'Api\NotificationController@update');



    Route::apiResource('chats','Api\ChatController');

    Route::post('chats-messages','Api\ChatController@sendMassMessage');

    Route::post('chats/{chatId}/messages','Api\ChatController@createMessage');

    Route::post('chats/{chatId}/attachment','Api\ChatController@createAttachment');

    Route::get('chats/{chatId}/messages','Api\ChatController@chatMessageList');

    Route::get('chats/{chatId}/messages/{id}','Api\ChatController@showChatMessage');

    Route::put('chats/{chatId}/messages/{id}','Api\ChatController@updateChatMessage');

    Route::put('chats/{chatId}/messages','Api\ChatController@updateAllMessages');

    Route::delete('chats/{chatId}/messages/{id}','Api\ChatController@deleteMessage');

    Route::apiResource('chats.users', 'Api\ChatUserRelationController');

    Route::put('chats/{chatId}','Api\ChatController@update');

    Route::get('chats/{chatId}/profileMatchings','Api\ChatController@profileMatchingList');

    Route::put('chats/{chatId}/profileMatchings','Api\ChatController@addProfileMatching');

    Route::delete('chats/{chatId}/profileMatchings/{profileId}','Api\ChatController@deleteProfileMatching');

    Route::post('req-profiles/{id}/messages','Api\ChatController@messageToReqProfile');

    Route::post('req-profiles/{id}/attachment','Api\ChatController@attachmentToReqProfile');

    Route::post('req-profiles/{id}/direct-invite', 'Api\Matching\MatchingInviteController@directInvite');

    Route::get('req-profiles/{id}/matches', 'Api\ReqProfileController@findMatches');
    Route::get('req-profiles/{id}/matches/count', 'Api\ReqProfileController@countMatches');

    Route::get('invoices','Api\SubscriptionController@invoices');

    Route::post('subscriptions','Api\SubscriptionController@store');

    Route::get('subscriptions/main-active','Api\SubscriptionController@getMainActive');

    Route::get('my-subscription','Api\SubscriptionController@show');

    Route::put('subscriptions/cancel','Api\SubscriptionController@cancel');

    Route::put('subscriptions/change-plan','Api\SubscriptionController@changePlan');

    Route::put('email-notifications', 'Api\AuthController@toggleEmailNotificationsActive');

    Route::get('users', 'Api\UserController@index');

    Route::get('users/current', 'Api\UserController@show');

    Route::delete('users','Api\AuthController@removeUser');

    Route::post('files', 'Api\FileController@store');

    Route::post('users/auth/{userId}', 'Api\AuthController@changeAuth');

    Route::get('check-coupon', 'Api\SubscriptionController@checkCoupon');

    Route::put('user-profile/{id}', 'Api\UserProfileController@update');
    Route::get('user-profile/{id}', 'Api\UserProfileController@show');

    Route::post('spec-profiles/{specProfileId}/educations', 'Api\SpecProfiles\EducationController@store');

    Route::put('spec-profiles/{specProfileId}/educations/{educationId}', 'Api\SpecProfiles\EducationController@update');

    Route::delete('spec-profiles/{specProfileId}/educations/{educationId}', 'Api\SpecProfiles\EducationController@destroy');

    Route::post('spec-profiles/{specProfileId}/credits', 'Api\SpecProfiles\CreditController@store');

    Route::put('spec-profiles/{specProfileId}/credits/{creditId}', 'Api\SpecProfiles\CreditController@update');

    Route::delete('spec-profiles/{specProfileId}/credits/{creditId}', 'Api\SpecProfiles\CreditController@destroy');

    Route::put('req-profiles/{id}/audition-sides', 'Api\ReqProfileController@changeAuditionSides');

    Route::put('profile-matchings/{id}/audition-tapes', 'Api\ProfileMatchingController@changeAuditionTapes');


    Route::post('categories/{categoryId}/functionalities', 'Api\Category\FunctionalityController@addFunctionality');

    Route::delete('categories/{categoryId}/functionalities/{functionalityId}', 'Api\Category\FunctionalityController@removeFunctionality');

    Route::get('category-label-definitions', 'Api\Category\CategoryLabelDefinitionController@index');

    Route::resource('categories.labels', 'Api\Category\CategoryLabelController');

    Route::get('reports/top-spec-profiles', 'Api\ReportController@getTopSpecProfilesByUser');

    Route::get('reports/latest-spec-profiles', 'Api\ReportController@getLatestSpecProfilesByUser');

    Route::get('reports/top-booked-categories', 'Api\ReportController@getTopBookedCategoriesByUser');

    Route::get('reports/latest-req-profiles', 'Api\ReportController@getLatestReqProfilesByUser');

    Route::get('measure-units', 'Api\MeasureUnitController@index');

    Route::apiResource('projects.call-sheets', 'Api\CallSheetController');

    Route::post('call-sheets/{callSheetId}/notifications', 'Api\CallSheetController@sendNotificationPdf');

    Route::apiResource('calendars', 'Api\Calendar\CalendarController');

    Route::apiResource('calendars.events', 'Api\Calendar\CalendarEventController');

    Route::post('pending-process-invites', 'Api\Base\PendingProcessInviteController@store');

    Route::get('projects/{projectId}/chat/', 'Api\ProjectController@getChatByUser');

    Route::apiResource('account-plans.features', 'Api\AccountPlanFeatureRelationController');

    Route::apiResource('account-plan-features', 'Api\AccountPlanFeatureController');

    Route::apiResource('account-plans', 'Api\AccountPlanController');

    Route::apiResource('roles', 'Api\RoleController');

    Route::apiResource('permissions', 'Api\PermissionController');

    Route::apiResource('roles.permissions','Api\RolePermissionController');

    Route::post('rolecalls/{id}/invites', 'Api\Matching\ProfileMatchingInviteController@submitToRoleCall');

    Route::post('profiles/{id}/invites', 'Api\Matching\ProfileMatchingInviteController@submitToProfile');
});

Route::middleware(['setLastActive'])->group(function () {

    Route::get('projects/{id}/profile-matchings', 'Api\ProjectController@getAllProfileMatching');

    Route::apiResource('call-sheets.crew-schedules', 'Api\CrewScheduleController');

    Route::apiResource('call-sheets.motion-tellers', 'Api\MotionTellerController');

    Route::apiResource('call-sheets.general-schedules', 'Api\GeneralScheduleController');

    Route::apiResource('call-sheets.locations', 'Api\CallSheetLocationController');

    Route::apiResource('call-sheets.talent-schedules', 'Api\TalentScheduleController');

    Route::apiResource('call-sheets.extras', 'Api\CallSheetExtraController');

    Route::apiResource('call-sheets.schedule', 'Api\CallSheetScheduleController');

    Route::apiResource('project-team-roles', 'Api\ProjectTeam\RoleController');

    Route::apiResource('project-team-permissions', 'Api\ProjectTeam\PermissionController');

    Route::apiResource('project-team-roles.permissions', 'Api\ProjectTeam\RolePermissionController');

    Route::get('project/{id}/my-member', 'Api\ProjectTeam\MemberController@show');

    Route::apiResource('projects.members', 'Api\ProjectTeam\MemberController');
});

Route::get('invites/{inviteToken}', 'Api\Base\InviteController@show');

Route::get('members/{id}', 'Api\ProjectTeam\MemberController@getById');

Route::get('call-sheet/{id}/invite-confirmation', 'Api\CallSheetController@confirmInvitedCallSheet')->middleWare('setLastActive');

Route::post('accept-invite-team/{member}','Api\ProjectTeam\MemberController@acceptInviteTeam');

Route::post('resend-invite-team/{member}','Api\ProjectTeam\MemberController@resendInviteTeam');

Route::get('resource/latest-items', 'Api\ResourceItemController@getLatestItemsByUser')->middleWare('setLastActive');