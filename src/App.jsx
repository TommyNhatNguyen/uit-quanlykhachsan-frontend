import axios from "axios";
import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import "./admin.css";

import { paymentMap, statusMap, tierForSpend, TODAY } from "./constants";
import { EMPTY_STATE } from "./data/seed";
import { downloadCSV, fmtVND, toCSV } from "./utils";

import ConfirmModal from "./components/ConfirmModal";
import Sidebar from "./components/Sidebar";
import Toast from "./components/Toast";
import Topbar from "./components/Topbar";

import BookingsPage from "./components/pages/BookingsPage";
import CustomersPage from "./components/pages/CustomersPage";
import DashboardPage from "./components/pages/DashboardPage";
import EmployeesPage from "./components/pages/EmployeesPage";
import IntegrationPage from "./components/pages/IntegrationPage";
import PaymentsPage from "./components/pages/PaymentsPage";
import ReportsPage from "./components/pages/ReportsPage";
import RoomsPage from "./components/pages/RoomsPage";
import ServicesPage from "./components/pages/ServicesPage";

import BookingDetailModal from "./components/modals/BookingDetailModal";
import BookingFormModal from "./components/modals/BookingFormModal";
import CustomerDetailModal from "./components/modals/CustomerDetailModal";
import CustomerFormModal from "./components/modals/CustomerFormModal";
import EmployeeFormModal from "./components/modals/EmployeeFormModal";
import PaymentFormModal from "./components/modals/PaymentFormModal";
import PriceFormModal from "./components/modals/PriceFormModal";
import RoomFormModal from "./components/modals/RoomFormModal";
import ServiceFormModal from "./components/modals/ServiceFormModal";

const API_BASE = "https://pantry-anatomist-prepaid.ngrok-free.dev";

export default function App() {
  const [data, setData] = useState(EMPTY_STATE);
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const [modal, setModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/state`, {
        headers: { "ngrok-skip-browser-warning": true },
      })
      .then((res) => setData({ ...EMPTY_STATE, ...res.data }))
      .catch((e) => {
        console.warn("API không kết nối được, dùng chế độ offline:", e);
        setData({ ...EMPTY_STATE });
      });
  }, []);

  const persist = (newData) => {
    setData(newData);
    axios
      .put(`${API_BASE}/api/state`, newData, {
        headers: { "ngrok-skip-browser-warning": true },
      })
      .catch((e) => console.warn("saveState lỗi:", e));
  };

  const toast = (msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3700,
    );
  };

  const openModal = (type, extra = {}) => setModal({ type, ...extra });
  const closeModal = () => setModal(null);

  const pushNotif = (title, sub, icon = "🔔") => {
    const newData = {
      ...data,
      notifications: [
        { id: Date.now(), title, sub, time: "Vừa xong", unread: true, icon },
        ...data.notifications,
      ].slice(0, 15),
    };
    persist(newData);
  };

  // ---- BOOKINGS ----
  const submitBooking = (formData) => {
    const customer = data.customers.find((c) => c.id === +formData.customerId);
    const room = data.rooms.find((r) => r.number === formData.room);
    if (!customer || !room) {
      toast("Dữ liệu không hợp lệ", "error");
      return;
    }

    const nights = Math.max(
      1,
      Math.round(
        (new Date(formData.checkout) - new Date(formData.checkin)) / 86400000,
      ),
    );
    const amount = nights * room.price * Math.max(1, +formData.quantity);

    let newData;
    if (formData.id) {
      newData = {
        ...data,
        bookings: data.bookings.map((b) =>
          b.id === formData.id
            ? {
                ...b,
                customerId: customer.id,
                customer: customer.name,
                checkin: formData.checkin,
                checkout: formData.checkout,
                rooms: formData.room,
                amount,
                notes: formData.notes || "",
              }
            : b,
        ),
      };
      toast(`Đã cập nhật booking #${formData.id}`, "success");
    } else {
      const newId = "BK-" + data.counters.booking;
      newData = {
        ...data,
        bookings: [
          {
            id: newId,
            customerId: customer.id,
            customer: customer.name,
            checkin: formData.checkin,
            checkout: formData.checkout,
            rooms: formData.room,
            status: "pending",
            payment: "unpaid",
            amount,
            notes: formData.notes || "",
          },
          ...data.bookings,
        ],
        notifications: [
          {
            id: Date.now(),
            title: `Booking mới #${newId}`,
            sub: `${customer.name} · ${fmtVND(amount)} ₫`,
            time: "Vừa xong",
            unread: true,
            icon: "📅",
          },
          ...data.notifications,
        ].slice(0, 15),
        counters: { ...data.counters, booking: data.counters.booking + 1 },
      };
      toast(`Đã tạo booking #${newId}`, "success");
    }
    persist(newData);
    closeModal();
  };

  const changeBookingStatus = (id, newStatus) => {
    let newData = { ...data };
    newData.bookings = data.bookings.map((b) => {
      if (b.id !== id) return b;
      const updated = { ...b, status: newStatus };
      if (newStatus === "checked_out") updated.payment = "paid";
      return updated;
    });

    const booking = data.bookings.find((b) => b.id === id);
    if (booking) {
      if (newStatus === "checked_in") {
        newData.rooms = data.rooms.map((r) =>
          booking.rooms
            .split(",")
            .map((n) => n.trim())
            .includes(r.number)
            ? { ...r, status: "occupied" }
            : r,
        );
      } else if (newStatus === "checked_out") {
        newData.rooms = data.rooms.map((r) =>
          booking.rooms
            .split(",")
            .map((n) => n.trim())
            .includes(r.number)
            ? { ...r, status: "available" }
            : r,
        );
        newData.customers = data.customers.map((c) => {
          if (c.id !== booking.customerId) return c;
          const newTotal = c.totalPaid + booking.amount;
          return { ...c, totalPaid: newTotal, tier: tierForSpend(newTotal) };
        });
      }
    }
    persist(newData);
    toast(
      `Đã chuyển booking #${id} → ${statusMap[newStatus].label}`,
      "success",
    );
  };

  const cancelBooking = (id) => {
    setConfirm({
      message: `Huỷ booking <strong>#${id}</strong>? Hành động này không thể hoàn tác.`,
      title: "Huỷ booking",
      okLabel: "Huỷ booking",
      danger: true,
      onOk: () => {
        const newData = {
          ...data,
          bookings: data.bookings.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status: "cancelled",
                  payment: b.payment === "paid" ? "refunded" : b.payment,
                  amount: 0,
                }
              : b,
          ),
        };
        persist(newData);
        toast(`Đã huỷ booking #${id}`, "warning");
      },
    });
  };

  const deleteBooking = (id) => {
    setConfirm({
      message: `Xoá vĩnh viễn booking <strong>#${id}</strong>?`,
      title: "Xoá booking",
      okLabel: "Xoá",
      danger: true,
      onOk: () => {
        persist({
          ...data,
          bookings: data.bookings.filter((b) => b.id !== id),
        });
        toast(`Đã xoá booking #${id}`, "success");
      },
    });
  };

  // ---- CUSTOMERS ----
  const submitCustomer = (formData) => {
    let newData;
    if (formData.id) {
      newData = {
        ...data,
        customers: data.customers.map((c) =>
          c.id === +formData.id
            ? {
                ...c,
                name: formData.name,
                sex: formData.sex,
                dob: formData.dob,
                phone: formData.phone,
                email: formData.email,
                notes: formData.notes,
              }
            : c,
        ),
      };
      toast("Đã cập nhật khách hàng", "success");
    } else {
      const id = data.counters.customer;
      newData = {
        ...data,
        customers: [
          ...data.customers,
          {
            id,
            name: formData.name,
            sex: formData.sex,
            dob: formData.dob,
            phone: formData.phone,
            email: formData.email,
            tier: "Silver",
            totalPaid: 0,
            notes: formData.notes || "",
          },
        ],
        counters: { ...data.counters, customer: id + 1 },
      };
      toast(`Đã thêm khách hàng: ${formData.name}`, "success");
    }
    persist(newData);
    closeModal();
  };

  const deleteCustomer = (id) => {
    const c = data.customers.find((x) => x.id === id);
    if (!c) return;
    const hasBookings = data.bookings.some((b) => b.customerId === c.id);
    if (hasBookings) {
      toast(
        "Không thể xoá: khách có booking. Hãy xoá các booking trước.",
        "error",
      );
      return;
    }
    setConfirm({
      message: `Xoá khách hàng <strong>${c.name}</strong>?`,
      title: "Xoá khách hàng",
      okLabel: "Xoá",
      danger: true,
      onOk: () => {
        persist({
          ...data,
          customers: data.customers.filter((x) => x.id !== id),
        });
        toast("Đã xoá khách hàng", "success");
      },
    });
  };

  // ---- ROOMS ----
  const submitRoom = (formData) => {
    const payload = {
      number: formData.number.trim(),
      type: formData.type,
      price: +formData.price,
      capacity: formData.capacity,
      area: formData.area || "—",
      smoking: formData.smoking === "true",
      status: formData.status,
    };
    if (formData.number_old) {
      if (
        payload.number !== formData.number_old &&
        data.rooms.some((r) => r.number === payload.number)
      ) {
        toast("Số phòng đã tồn tại", "error");
        return;
      }
      persist({
        ...data,
        rooms: data.rooms.map((r) =>
          r.number === formData.number_old ? payload : r,
        ),
      });
      toast(`Đã cập nhật phòng ${payload.number}`, "success");
    } else {
      if (data.rooms.some((r) => r.number === payload.number)) {
        toast("Số phòng đã tồn tại", "error");
        return;
      }
      persist({ ...data, rooms: [...data.rooms, payload] });
      toast(`Đã thêm phòng ${payload.number}`, "success");
    }
    closeModal();
  };

  const deleteRoom = (number) => {
    setConfirm({
      message: `Xoá phòng <strong>${number}</strong>?`,
      title: "Xoá phòng",
      okLabel: "Xoá",
      danger: true,
      onOk: () => {
        persist({
          ...data,
          rooms: data.rooms.filter((r) => r.number !== number),
        });
        toast(`Đã xoá phòng ${number}`, "success");
        closeModal();
      },
    });
  };

  const submitPrice = (formData) => {
    const newLog = {
      id: data.counters.price,
      roomNumber: formData.roomNumber,
      from: formData.from,
      to: formData.to || null,
      price: +formData.price,
    };
    const newRooms = data.rooms.map((r) => {
      if (r.number !== formData.roomNumber) return r;
      if (!formData.to || formData.to >= TODAY)
        return { ...r, price: +formData.price };
      return r;
    });
    persist({
      ...data,
      priceLogs: [...data.priceLogs, newLog],
      rooms: newRooms,
      counters: { ...data.counters, price: data.counters.price + 1 },
    });
    toast(`Đã áp giá mới cho phòng ${formData.roomNumber}`, "success");
    closeModal();
  };

  // ---- SERVICES ----
  const submitService = (formData) => {
    let newData;
    if (formData.id) {
      newData = {
        ...data,
        services: data.services.map((s) =>
          s.id === +formData.id
            ? {
                ...s,
                name: formData.name,
                catalog: formData.catalog,
                price: +formData.price,
              }
            : s,
        ),
      };
      toast("Đã cập nhật dịch vụ", "success");
    } else {
      newData = {
        ...data,
        services: [
          ...data.services,
          {
            id: data.counters.service,
            name: formData.name,
            catalog: formData.catalog,
            price: +formData.price,
            used: 0,
          },
        ],
        counters: { ...data.counters, service: data.counters.service + 1 },
      };
      toast("Đã thêm dịch vụ", "success");
    }
    persist(newData);
    closeModal();
  };

  const deleteService = (id) => {
    const s = data.services.find((x) => x.id === id);
    setConfirm({
      message: `Xoá dịch vụ <strong>${s?.name}</strong>?`,
      title: "Xoá dịch vụ",
      okLabel: "Xoá",
      danger: true,
      onOk: () => {
        persist({
          ...data,
          services: data.services.filter((x) => x.id !== id),
        });
        toast("Đã xoá dịch vụ", "success");
        closeModal();
      },
    });
  };

  // ---- EMPLOYEES ----
  const submitEmployee = (formData) => {
    let newData;
    if (formData.id) {
      newData = {
        ...data,
        employees: data.employees.map((e) =>
          e.id === formData.id
            ? {
                ...e,
                name: formData.name,
                dob: formData.dob,
                phone: formData.phone,
                position: formData.position,
                start: formData.start,
                working: formData.working === "true",
              }
            : e,
        ),
      };
      toast("Đã cập nhật nhân viên", "success");
    } else {
      const id = "EMP-" + String(data.counters.employee).padStart(3, "0");
      newData = {
        ...data,
        employees: [
          ...data.employees,
          {
            id,
            name: formData.name,
            dob: formData.dob,
            phone: formData.phone,
            position: formData.position,
            start: formData.start,
            working: formData.working === "true",
          },
        ],
        counters: { ...data.counters, employee: data.counters.employee + 1 },
      };
      toast("Đã thêm nhân viên", "success");
    }
    persist(newData);
    closeModal();
  };

  const deleteEmployee = (id) => {
    const e = data.employees.find((x) => x.id === id);
    setConfirm({
      message: `Xoá nhân viên <strong>${e?.name}</strong>?`,
      title: "Xoá nhân viên",
      okLabel: "Xoá",
      danger: true,
      onOk: () => {
        persist({
          ...data,
          employees: data.employees.filter((x) => x.id !== id),
        });
        toast("Đã xoá nhân viên", "success");
        closeModal();
      },
    });
  };

  // ---- PAYMENTS ----
  const submitPayment = (formData) => {
    const booking = data.bookings.find((b) => b.id === formData.bookingId);
    if (!booking) {
      toast("Booking không tồn tại", "error");
      return;
    }
    const id = "PAY-" + data.counters.payment;
    const newPayment = {
      id,
      bookingId: booking.id,
      customer: booking.customer,
      method: formData.method,
      cashier: formData.cashier,
      datetime: formData.datetime || new Date().toISOString().slice(0, 16),
      amount: +formData.amount,
      status: "success",
    };
    const allPayments = [newPayment, ...data.payments];
    const totalPaid = allPayments
      .filter((p) => p.bookingId === booking.id && p.amount > 0)
      .reduce((s, p) => s + p.amount, 0);
    const newPaymentStatus =
      totalPaid >= booking.amount
        ? "paid"
        : totalPaid > 0
          ? "partial"
          : "unpaid";

    persist({
      ...data,
      payments: allPayments,
      bookings: data.bookings.map((b) =>
        b.id === booking.id ? { ...b, payment: newPaymentStatus } : b,
      ),
      notifications: [
        {
          id: Date.now(),
          title: "Thanh toán mới",
          sub: `${id} — ${fmtVND(+formData.amount)} ₫`,
          time: "Vừa xong",
          unread: true,
          icon: "💳",
        },
        ...data.notifications,
      ].slice(0, 15),
      counters: { ...data.counters, payment: data.counters.payment + 1 },
    });
    toast(`Đã ghi nhận thanh toán ${fmtVND(+formData.amount)} ₫`, "success");
    closeModal();
  };

  // ---- MISC ----
  const resetData = () => {
    setConfirm({
      message:
        "Khôi phục toàn bộ dữ liệu về trạng thái mẫu? Các thay đổi sẽ mất.",
      title: "Reset dữ liệu",
      okLabel: "Khôi phục",
      danger: false,
      onOk: async () => {
        try {
          await axios.post(
            `${API_BASE}/api/state/reset`,
            {},
            {
              headers: { "ngrok-skip-browser-warning": true },
            },
          );
        } catch (e) {
          console.warn("Reset lỗi:", e);
        }
        setData({ ...EMPTY_STATE });
        toast("Đã xoá toàn bộ dữ liệu", "success");
      },
    });
  };

  const markAllNotifsRead = () => {
    const newData = {
      ...data,
      notifications: data.notifications.map((n) => ({ ...n, unread: false })),
    };
    persist(newData);
    toast("Đã đánh dấu tất cả đã đọc", "success");
  };

  const exportBookingsCSV = () => {
    const csv = toCSV(data.bookings, [
      { label: "Mã", key: "id" },
      { label: "Khách", key: "customer" },
      { label: "Check-in", key: "checkin" },
      { label: "Check-out", key: "checkout" },
      { label: "Phòng", key: "rooms" },
      { label: "Trạng thái", v: (b) => statusMap[b.status].label },
      { label: "Thanh toán", v: (b) => paymentMap[b.payment].label },
      { label: "Số tiền", key: "amount" },
    ]);
    downloadCSV(`bookings_${TODAY}.csv`, csv);
    toast("Đã xuất CSV", "success");
  };

  const navigateTo = (page) =>
    navigate(page === "dashboard" ? "/" : `/${page}`);
  const pageProps = { data, persist, openModal, toast, navigateTo };

  return (
    <div className="app">
      <Sidebar data={data} onReset={resetData} />
      <main className="main">
        <Topbar
          data={data}
          persist={persist}
          toast={toast}
          navigateTo={navigateTo}
          openModal={openModal}
          onMarkAllRead={markAllNotifsRead}
        />
        <div className="content">
          <Routes>
            <Route path="/" element={<DashboardPage {...pageProps} />} />
            <Route
              path="/bookings"
              element={
                <BookingsPage
                  {...pageProps}
                  onChangeStatus={changeBookingStatus}
                  onCancel={cancelBooking}
                  onDelete={deleteBooking}
                />
              }
            />
            <Route path="/rooms" element={<RoomsPage {...pageProps} />} />
            <Route
              path="/customers"
              element={
                <CustomersPage {...pageProps} onDelete={deleteCustomer} />
              }
            />
            <Route path="/services" element={<ServicesPage {...pageProps} />} />
            <Route path="/payments" element={<PaymentsPage {...pageProps} />} />
            <Route path="/reports" element={<ReportsPage {...pageProps} />} />
            <Route
              path="/employees"
              element={<EmployeesPage {...pageProps} />}
            />
            <Route path="/integration" element={<IntegrationPage />} />
          </Routes>
        </div>
      </main>

      {/* Modals */}
      {modal?.type === "booking-form" && (
        <BookingFormModal
          id={modal.id}
          data={data}
          onClose={closeModal}
          onSubmit={submitBooking}
          prefillCustomerId={modal.customerId}
        />
      )}
      {modal?.type === "booking-detail" && (
        <BookingDetailModal
          booking={data.bookings.find((b) => b.id === modal.id)}
          onClose={closeModal}
          onEdit={(id) => openModal("booking-form", { id })}
          onChangeStatus={changeBookingStatus}
        />
      )}
      {modal?.type === "customer-form" && (
        <CustomerFormModal
          id={modal.id}
          data={data}
          onClose={closeModal}
          onSubmit={submitCustomer}
        />
      )}
      {modal?.type === "customer-detail" && (
        <CustomerDetailModal
          customer={data.customers.find((c) => c.id === modal.id)}
          data={data}
          onClose={closeModal}
          onEdit={(id) => openModal("customer-form", { id })}
        />
      )}
      {modal?.type === "room-form" && (
        <RoomFormModal
          roomNumber={modal.roomNumber}
          data={data}
          onClose={closeModal}
          onSubmit={submitRoom}
          onDelete={deleteRoom}
        />
      )}
      {modal?.type === "service-form" && (
        <ServiceFormModal
          id={modal.id}
          data={data}
          onClose={closeModal}
          onSubmit={submitService}
          onDelete={deleteService}
        />
      )}
      {modal?.type === "employee-form" && (
        <EmployeeFormModal
          id={modal.id}
          data={data}
          onClose={closeModal}
          onSubmit={submitEmployee}
          onDelete={deleteEmployee}
        />
      )}
      {modal?.type === "payment-form" && (
        <PaymentFormModal
          data={data}
          onClose={closeModal}
          onSubmit={submitPayment}
        />
      )}
      {modal?.type === "price-form" && (
        <PriceFormModal
          data={data}
          onClose={closeModal}
          onSubmit={submitPrice}
        />
      )}

      <Toast
        toasts={toasts}
        onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
      {confirm && (
        <ConfirmModal {...confirm} onClose={() => setConfirm(null)} />
      )}
    </div>
  );
}
