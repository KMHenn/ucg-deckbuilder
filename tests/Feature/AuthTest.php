<?php

use App\Support\Enums\UserRolesEnum;
use App\Models\User;

pest()->group('auth');

// @TODO these broke

describe('POST /auth/register', function(){
    it('registers a new user', function () {
        $accountDetails = [
            'username' => 'newUsername',
            'password' => 'newPassword',
            'password_confirmation' => 'newPassword',
        ];

        $response = $this->withHeader('Accept', 'application/json')->post('/auth/register', $accountDetails);
        $response->assertCreated();

        $data = $response->json()['data'];
        $this->assertDatabaseHas('users', [
            'id' => $data['id'],
            'username' => $data['username'],
            'role' => UserRolesEnum::USER->value,
        ]);
        

        $user = User::find($data['id']);
        $this->assertAuthenticatedAs($user);
        $this->assertDatabaseCount('users', 1);

        $response->assertJson([
            'data' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role->value,
            ]
        ]);
    });

    it('can\'t register a user when the username is taken', function(){
        User::factory()->username('newUsername')->create();
        $this->assertDatabaseCount('users', 1);


        $accountDetails = [
            'username' => 'newUsername',
            'password' => 'newPassword',
            'password_confirmation' => 'newPassword',
        ];

        $response = $this->postJson('/auth/register', $accountDetails);
        $response->assertInvalid('username');
        $this->assertDatabaseCount('users', 1);
    });

    it('can\'t register a user if the password is fewer than 8 characters', function(){
        $accountDetails = [
            'username' => 'newUsername',
            'password' => 'newPW',
            'password_confirmation' => 'newPW',
        ];

        $response = $this->postJson('/auth/register', $accountDetails);
        $response->assertInvalid('password');
        $this->assertDatabaseCount('users', 0);
    });

    it('can\'t register a user if the password fields don\'t match', function(){
        $accountDetails = [
            'username' => 'newUsername',
            'password' => 'newPassword',
            'password_confirmation' => 'anotherPassword',
        ];

        $response = $this->postJson('/auth/register', $accountDetails);
        $response->assertInvalid('password');
        $this->assertDatabaseCount('users', 0);
    });

    it('can\'t register a user if the username field is empty', function(){
        $accountDetails = [
            'username' => null,
            'password' => 'newPassword',
            'password_confirmation' => 'newPassword',
        ];

        $response = $this->postJson('/auth/register', $accountDetails);
        $response->assertInvalid('username');
        $this->assertDatabaseCount('users', 0);
    });
    
    it('can\'t register a user if the password field is empty', function(){
        $accountDetails = [
            'username' => 'newUsername',
            'password' => null,
            'password_confirmation' => 'newPassword',
        ];

        $response = $this->postJson('/auth/register', $accountDetails);
        $response->assertInvalid('password');
        $this->assertDatabaseCount('users', 0);
    });

    it('can\'t register a user if the password confirmation field is empty', function(){
        $accountDetails = [
            'username' => 'newUsername',
            'password' => 'newPW',
            'password_confirmation' => null,
        ];

        $response = $this->postJson('/auth/register', $accountDetails);
        $response->assertInvalid('password');
        $this->assertDatabaseCount('users', 0);
    });
})->group('register');

describe('POST /auth/login', function(){
    it('logs in an existing user', function(){
        $password = 'myPassword';
        $user = User::factory()->password($password)->create();

        $credentials = [
            'username' => $user->username,
            'password' => $password,
        ];

        $response = $this->withSession([])->postJson('/auth/login', $credentials);
        $response->assertOk();
        $this->assertAuthenticatedAs($user);
        $response->assertJson([
            'data' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role->value,
            ]
        ]);
    });

    it('can\'t log in a user without a username', function(){
        $password = 'myPassword';
        User::factory()->password($password)->create();

        $credentials = [
            'username' => null,
            'password' => $password,
        ];

        $response = $this->withSession([])->postJson('/auth/login', $credentials);
        $response->assertInvalid('username');
    });

    it('can\'t log in a user without a password', function(){
        $password = 'myPassword';
        $user = User::factory()->password($password)->create();

        $credentials = [
            'username' => $user->username,
            'password' => null,
        ];

        $response = $this->withSession([])->postJson('/auth/login', $credentials);
        $response->assertInvalid('password');
    });

    it('can\'t log in a user with a username password mismatch', function(){
        $password = 'myPassword';
        $user = User::factory()->password($password)->create();

        $credentials = [
            'username' => $user->username,
            'password' => 'otherPassword',
        ];

        $response = $this->withSession([])->postJson('/auth/login', $credentials);
        $response->assertUnprocessable();
    });
})->group('login');

describe('POST /auth/logout', function(){
    it('logs out the current user', function(){
        // Log in
        $user = User::factory()->create();
        signIn($user);

        // Log out
        $response = $this->withSession([])->postJson('/auth/logout');
        $response->assertOk();
    });

    it('can\'t log someone out if no one is logged in', function(){
        $response = $this->withSession([])->postJson('/auth/logout');
        $response->assertUnauthorized();  
    });
})->group('logout');

describe('GET /auth/user', function(){
    it('gets details on the signed in user after login', function(){
        // Log in
        $user = User::factory()->create();
        signIn($user);

        $response = $this->withSession([])->getJson('/auth/user');
        $response->assertOk();
        $response->assertJson([
            'data' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role->value,
            ]
        ]);
    });

    it('can\'t get the signed in user if no one is signed in', function(){
        $response = $this->withSession([])->getJson('/auth/user');
        $response->assertUnauthorized();
    });
})->group('user');