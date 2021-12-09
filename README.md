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

  - [data](#data)
    - [images](#images)
    - [audios](#audios)

### Auth

Name | Method | Url | Values |
--- | --- | --- | --- |
Create account | POST | /api/user/create | username, email, password |
Login | POST | /api/user/login | username, password |
GetMe | GET | /api/user | None |

### Book

Name | Method | Url | Values |
--- | --- | --- | --- |
Create book | POST | /api/book/create | img, title, description, price, author, year, genre, language |
Get book by title | POST | /api/book/ | title |
Get books | GET | /api/book/?skip=0&limit=10 | None |
Delete a book | DELETE | /api/book/:ID | None |
Update a book | PUT | /api/book/:ID | Any |
Favourite Toggle | POST | /api/book/favourite | bookId |
Get Image | GET | /api/files/images/:FILENAME | None |
Get Audio | GET | /api/files/audios/:FILENAME | None |
Post filter | POST | /api/book/filter | newest, date, category, publisher, yearRange, priceRange, editorPicks |

### Audio Book

Name | Method | Url | Values |
--- | --- | --- | --- |
Create audioBook | POST | /api/audioBook/create | img, audio, title, description, price, author, year, genre, language |
Get audio book by title | POST | /api/audioBook/ | title |
Get audio books | GET | /api/audioBook/?skip=0&limit=10 | None |
Delete audo book | DELETE | /api/audioBook/:ID | None |
Update audo book | PUT | /api/audioBook/:ID | Any |
Favourite Toggle | POST | /api/book/favourite | audioBookId |

### News

Name | Method | Url | Values |
--- | --- | --- | --- |
Create News | POST | /api/news/create | img, title, description |
Get News | GET | /api/news | None |
Delete a News | DELETE | /api/news/:ID | None |
Update a News | PUT | /api/news/:ID | Any |

### Card
Name | Method | Url | Values |
--- | --- | --- | --- |
Create Card | POST | /api/card/create | productId, quantity |
Get Card | GET | /api/card/ | None |
Update Card | PUT | /api/card/:id | quantity |
Delete Card | DELETE | /api/card/:id | None |

### Discount
Name | Method | Url | Values |
--- | --- | --- | --- |
Create Discount | POST | /api/discount/create | productId, discount_percent, active |
Update Discount | PUT | /api/discount/:id | discount_percent OR/AND active |
Delete Discount | DELETE | /api/discount/:id | None |
