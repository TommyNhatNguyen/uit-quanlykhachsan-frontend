// -----------------
// Mới
// -----------------
// Chỉ 1 record để lưu thông tin
// Mở rộng: Nhiều hotel
Table hotel {
id int [pk]
name text [not null, unique]
address text [not null, unique]
phone int [not null, unique]
is_deleted bool [default: false]
}

Table n_room_type {
id int [pk]
name text [not null]
is_deleted bool [default: false]
}

Table n_room {
id int [pk]
room_num varchar(255) [not null]
room_name varchar(255) [not null]
capacity int [not null]
area float [not null]
is_smoking bool
has_wifi bool
has_pool bool
description text
room_type_id int [ref: > n_room_type.id]
hotel_id int [ref: > hotel.id]
current_price_per_night float [not null]
is_deleted bool [default: false]
is_underconstruction bool
}

Table n_room_price_log {
id int [pk]
room_id int [not null, ref: > n_room.id]
created_at datetime
price_per_night float [not null]
}

Table n_membership {
id int [pk]
name text [not null]
paid_from float
paid_to float
is_deleted bool [default: false]
}

Table n_customer {
id int [pk]
name text [not null]
phone int [not null, unique]
sex int [not null]
email text [unique]
birthday datetime
identification_id text [not null, unique]
membership_type_id int [ref: > n_membership.id]
}

Table employee_account {
id int [pk]
username text [not null, unique]
password text [not null, unique]
created_at datetime
}

enum Role {
admin
staff
accountant
}

Table n_employee {
id int [pk]
name text [not null]
birthday datetime
phone int [not null]
is_working bool
position text
start_working_date datetime [not null]
employee_account_id int [ref: - employee_account.id]
is_deleted bool [default: false]
role Role [default: Role.staff]
}

enum BookingStatus {
BOOKED
CANCELED
CHECKIN
CHECKOUT
}

Table n_booking {
id int [pk]
customer_id int [not null, ref: > n_customer.id]
created_at datetime
notes text
is_fully_paid bool [not null, default: false]
is_deleted bool [default: false]
}

Table n_booking_detail {
id int [pk]
booking_id int [not null, ref: > n_booking.id]
room_id int [not null, ref: > n_room.id]
checkin_date datetime [not null]
checkout_date datetime [not null]
quantity_of_nights int [not null]
price_per_night float [not null]
total_room_amount float [not null]
total_service_amount float
total_amount float [not null, default: 0]
is_fully_paid bool [not null, default: false]
status BookingStatus [not null, default: BookingStatus.BOOKED]
}

Table n_payment {
id int [pk]
cashier_id int [ref: > n_employee.id, not null]
total_payment float [not null]
payment_method text [not null]
booking_detail_id int [ref: > n_booking_detail.id, not null]
created_at datetime
is_deleted bool [default: false]
}

Table n_booking_detail_services {
id int [pk]
booking_detail_id int [not null, ref: > n_booking_detail.id]
service_id int [not null, ref: > n_service.id]
quanity int [not null]
price float [not null]
total_amount float [not null]
}

Table n_service {
id int [pk]
name text [not null]
catalog text
current_price float [not null, default: 0]
}

Table n_service_log {
id int [pk]
service_id int [not null, ref: > n_service.id]
created_at datetime
price float [not null]
}

// -----------------
// Cũ
// -----------------

Project hotel_management {
database_type: "SQL Server"
}

Table booking {
booking_id int [pk]
customer_id int
checkin_datetime datetime
checkout_datetime datetime
status nvarchar
payment_id int
hotel_id int
created_at datetime
notes nvarchar
}

Table booking_detail {
booking_detail_id int [pk]
booking_id int
room_id int
quantity float121
price float
amount float
}

Table counters {
name nvarchar [pk]
value int [default: 0]
}

Table customer {
customer_id int [pk]
customer_name nvarchar
sex nvarchar
phone nvarchar
email nvarchar
birthday date
membership_type_id int
total_paid float
}

Table customer_history_purchase {
id int [pk]
customer_id int
booking_id int
booking_paid float
cumulative_paid float
}

Table employee {
employee_id int [pk]
employee_name nvarchar
birthday date
phone nvarchar
is_working nvarchar
position nvarchar
start_working_date date
}

Table membership_type {
membership_type_id int [pk]
membership_type_name nvarchar
paid_from float
paid_to float
}

Table notifications {
id bigint [pk]
title nvarchar
sub nvarchar
time_str nvarchar
unread bit [default: 1]
icon nvarchar [default: "🔔"]
}

Table payment {
payment_id int [pk]
status nvarchar
}

Table payment_detail {
payment_detail_id int [pk]
cashier_id int
payment_id int
total_payment float
payment_method nvarchar
payment_datetime datetime
}

Table room {
room_id int [pk]
room_number nvarchar
room_type_id int
price_per_night float
capacity nvarchar
room_area nvarchar
is_smoking bit
description nvarchar
}

Table room_inventory {
room_id int [pk]
room_number nvarchar
room_type_id int
is_available float
updated_at datetime
}

Table room_inventory_log {
id int [pk]
room_id int
room_number nvarchar
room_type_id int
is_available float
created_at datetime
}

Table room_log_price {
id int [pk]
room_id int
using_form_datetime datetime
using_to_datetime datetime
price_per_night float
}

Table room_type {
room_type_id int [pk]
room_type_name nvarchar
}

Table service_detail {
service_detail int [pk]
booking_id int
service_item_id int
quantity float
price float
amount float
}

Table service_item {
service_item_id int [pk]
service_item_name nvarchar
catalog nvarchar
price float
used_count int [default: 0]
}

//// Relationships

Ref: booking.customer_id > customer.customer_id
Ref: booking.payment_id > payment.payment_id

Ref: booking_detail.booking_id > booking.booking_id
Ref: booking_detail.room_id > room.room_id

Ref: customer.membership_type_id > membership_type.membership_type_id

Ref: customer_history_purchase.customer_id > customer.customer_id
Ref: customer_history_purchase.booking_id > booking.booking_id

Ref: payment_detail.payment_id > payment.payment_id
Ref: payment_detail.cashier_id > employee.employee_id

Ref: room.room_type_id > room_type.room_type_id
Ref: room_inventory.room_type_id > room_type.room_type_id

Ref: room_inventory_log.room_id > room_inventory.room_id

Ref: room_log_price.room_id > room.room_id

Ref: service_detail.booking_id > booking.booking_id
Ref: service_detail.service_item_id > service_item.service_item_id
