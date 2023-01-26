<?php

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.User.{id}', function ($user, $id) {
    return (int)$user->getId() === (int)$id;
});

Broadcast::channel('chat.{chatId}', function ($user, $chatId) {
    return (!is_null($user) && !is_null($chatId)) ? $user : null;
});