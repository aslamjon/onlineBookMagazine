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

### Book

Name | Method | Url | Values |
--- | --- | --- | --- |
Create book | POST | /server/onlineBook/api/book/create | img, title, description, price, author, year, genre, language |
Get book by title | POST | /server/onlineBook/api/book/ | title |
Get books | GET | /server/onlineBook/api/book/?skip=0&limit=10 | None |
Delete a book | DELETE | /server/onlineBook/api/book/:ID | None |
Update a book | PUT | /server/onlineBook/api/book/:ID | Any |
Favourite Toggle | POST | /server/onlineBook/api/book/favourite | bookId |
Get Image | GET | /server/onlineBook/api/files/images/:FILENAME | None |
Get Audio | GET | /server/onlineBook/api/files/audios/:FILENAME | None |

### Audio Book

Name | Method | Url | Values |
--- | --- | --- | --- |
Create audioBook | POST | /server/onlineBook/api/audioBook/create | img, audio, title, description, price, author, year, genre, language |
Get audio book by title | POST | /server/onlineBook/api/audioBook/ | title |
Get audio books | GET | /server/onlineBook/api/audioBook/?skip=0&limit=10 | None |
Delete audo book | DELETE | /server/onlineBook/api/audioBook/:ID | None |
Update audo book | PUT | /server/onlineBook/api/audioBook/:ID | Any |
Favourite Toggle | POST | /server/onlineBook/api/book/favourite | audioBookId |

### News

Name | Method | Url | Values |
--- | --- | --- | --- |
Create News | POST | /server/onlineBook/api/news/create | img, title, description |
Get News | GET | /server/onlineBook/api/news | None |
Delete a News | DELETE | /server/onlineBook/api/news/:ID | None |
Update a News | PUT | /server/onlineBook/api/news/:ID | Any |
