# onlineBookMagazine
Online Book Magazine

After downloaded the project open terminal in folder of the project

## Running Command
```
$ npm install
```
or
```
$ yarn
```
then should create folders like this:

data - </br>
      | - audios </br>
      | - images </br>
  - data](#data)
    - [images](#images)
    - [audios](#audios)

### Auth

Name | Method | Url | Values |
--- | --- | --- | --- |
Create account | POST | /server/onlineBook/api/user/create | username, email, password |

Login | POST | /server/onlineBook/api/user/login | username, password |

GetMe | GET | /server/onlineBook/api/user | None |
