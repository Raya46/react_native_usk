----- USER -----
api login = /login (need fill name<String> and password<String>)

api logout = /logout (need fill name<String> and password<String>)

api homeuser = /get-product-siswa

api topup = /topup (need fill credit<Int>)

api historyclear = /history-clear

api pay-product = /pay-product

api cancel-cart = /keranjang/delete/{id}

------ KANTIN ------
api transaction-kantin = /transaction-kantin

api verifikasi-pengambilan = /transaction-kantin/{id}

api delete-product = /delete-product/{id}

api get-data-kantin = /kantin

api create-product = /create-product (need fill name<String> price<Int> stock<Int> stand<String> photo<String> desc<String> categories_id<Int>) REAL PHOTO !!!

api get-categories = /kantin

api update-product = /product-update/{id} (need fill name<String> price<Int> stock<Int> stand<String> photo<String> desc<String> categories_id<Int>) REAL PHOTO !!!

api get-data-product = /product-edit/{id}

----- BANK -----
api get-data-bank = /bank

api accept-topup = /topup-success/{id}

api withdraw-bank = /withdraw-bank (need fill debit<Int>)

api withdraw-user = /withdraw (need fill users_id<Int> debit<Int>)

---- ADMIN -----
api get-data-siswa = /getsiswa

api delete-user = /user-admin-delete

api get-data-category = /category-admin

api delete-category = /category-admin-delete

api create-user = /user-admin-store (need fill name<String> password<String> roles_id<Int>)

api get-user-edit = /user-admin-edit

api update-user = /user-admin-update/{id} (need fill name<String> password<String> roles_id<Int>)

api create-category = /category-admin-store (need fill name<String>)

api update-category = /category-admin-update/{id} (need fill name<String>)

--- AVAILABLE ON ALL ROLE ---

api data-download = /history/{order_code}

api profilesiswa = /profilesiswa

api report-admin = /report-admin

api report-bank = /report-bank


