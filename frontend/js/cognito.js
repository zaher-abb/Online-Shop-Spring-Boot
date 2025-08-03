// // AWS Cognito configuration via AWS Amplify
// // Replace the placeholders with your Cognito details
// const awsConfig = {
//     Auth: {
//         region: 'us-east-1', // Replace with your region
//         userPoolId: 'us-east-1_5OC46tu6v',
//         userPoolWebClientId: '3n9fauvvecbpqns7d9v9oqfnho'
//     }
// };
//
// document.addEventListener('DOMContentLoaded', () => {
//     const { Amplify, Auth } = aws_amplify;
//     Amplify.configure(awsConfig);
//
//     const loginForm = document.getElementById('login-form');
//     const signupForm = document.getElementById('signup-form');
//
//     if (loginForm) {
//         loginForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             const email = e.target.email.value;
//             const password = e.target.password.value;
//             try {
//                 await Auth.signIn(email, password);
//                 alert('Login successful');
//             } catch (err) {
//                 alert(err.message || 'Login failed');
//             }
//         });
//     }
//
//     if (signupForm) {
//         signupForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             const email = e.target.email.value;
//             const password = e.target.password.value;
//             try {
//                 await Auth.signUp({ username: email, password });
//                 alert('Check your email for verification.');
//             } catch (err) {
//                 alert(err.message || 'Sign up failed');
//             }
//         });
//     }
// });
// import { UserManager } from 'oidc-client-ts';
//
// const cognitoAuthConfig = {
//     authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_50C46tu6v",
//     client_id: "1nirg0t4t25peqmrh1dhiaoc6n",
//     redirect_uri: "https://jessaherz.de/shop.html",
//     response_type: "code",
//     scope: "email openid phone"
// };
//
// export const userManager = new UserManager(cognitoAuthConfig);
//
// export async function signOutRedirect() {
//     const clientId = "1nirg0t4t25peqmrh1dhiaoc6n";
//     const logoutUri = "https://jessaherz.de/shop.html";  // your logout redirect URI
//     const cognitoDomain = "https://us-east-15oc46tu6v.auth.us-east-1.amazoncognito.com";
//     window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
// }
/*global WildRydes _config AmazonCognitoIdentity AWSCognito*/

var WildRydes = window.WildRydes || {};

(function scopeWrapper($) {
    var signinUrl = '/login.html';

    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    var userPool;

    if (!(_config.cognito.userPoolId &&
        _config.cognito.userPoolClientId &&
        _config.cognito.region)) {
        $('#noCognitoMessage').show();
        return;
    }

    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = _config.cognito.region;
    }

    WildRydes.signOut = function signOut() {
        userPool.getCurrentUser().signOut();
    };

    WildRydes.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        } else {
            resolve(null);
        }
    });


    /*
     * Cognito User Pool functions
     */

    function register(email, password, onSuccess, onFailure) {
        var dataEmail = {
            Name: 'email',
            Value: email
        };
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

        userPool.signUp(toUsername(email), password, [attributeEmail], null,
            function signUpCallback(err, result) {
                if (!err) {
                    onSuccess(result);
                } else {
                    onFailure(err);
                }
            }
        );
    }

    function signin(email, password, onSuccess, onFailure) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: toUsername(email),
            Password: password
        });

        var cognitoUser = createCognitoUser(email);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    }

    function verify(email, code, onSuccess, onFailure) {
        createCognitoUser(email).confirmRegistration(code, true, function confirmCallback(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        });
    }

    function createCognitoUser(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: toUsername(email),
            Pool: userPool
        });
    }

    function toUsername(email) {
        return email.replace('@', '-at-');
    }

    /*
     *  Event Handlers
     */

    $(function onDocReady() {
        $('#signinForm').submit(handleSignin);
        $('#registrationForm').submit(handleRegister);
        $('#verifyForm').submit(handleVerify);
    });

    function handleSignin(event) {
        var email = $('#emailInputSignin').val();
        var password = $('#passwordInputSignin').val();
        event.preventDefault();
        signin(email, password,
            function signinSuccess() {
                console.log('Successfully Logged In');
                window.location.href = 'ride.html';
            },
            function signinError(err) {
                alert(err);
            }
        );
    }

    function handleRegister(event) {
        var email = $('#emailInputRegister').val();
        var password = $('#passwordInputRegister').val();
        var password2 = $('#password2InputRegister').val();

        var onSuccess = function registerSuccess(result) {
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            var confirmation = ('Registration successful. Please check your email inbox or spam folder for your verification code.');
            if (confirmation) {
                window.location.href = 'verify.html';
            }
        };
        var onFailure = function registerFailure(err) {
            alert(err);
        };
        event.preventDefault();

        if (password === password2) {
            register(email, password, onSuccess, onFailure);
        } else {
            alert('Passwords do not match');
        }
    }

    function handleVerify(event) {
        var email = $('#emailInputVerify').val();
        var code = $('#codeInputVerify').val();
        event.preventDefault();
        verify(email, code,
            function verifySuccess(result) {
                console.log('call result: ' + result);
                console.log('Successfully verified');
                alert('Verification successful. You will now be redirected to the login page.');
                window.location.href = signinUrl;
            },
            function verifyError(err) {
                alert(err);
            }
        );
    }
}(jQuery));
