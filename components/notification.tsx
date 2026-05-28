"use client";

import * as Popover from "@radix-ui/react-popover";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  Search,
  Check,
  CheckCheck,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import notiApiRequest from "@/apiRequests/noti";
import type { NotificationItemType } from "@/schemaValidations/noti.schema";

export default function Notification() {
  const PAGE_SIZE = 3;

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItemType[]>(
    [],
  );
  const [notificationPage, setNotificationPage] = useState(0);
  const [notificationTotalPages, setNotificationTotalPages] = useState(0);
  const [notificationSearch, setNotificationSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [isMarkAllLoading, setIsMarkAllLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [isDetailLoadingId, setIsDetailLoadingId] = useState<string | null>(
    null,
  );
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItemType | null>(null);
  const [notificationError, setNotificationError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNotifications, setModalNotifications] = useState<NotificationItemType[]>([]);
  const [modalPage, setModalPage] = useState(0);
  const [modalTotalPages, setModalTotalPages] = useState(0);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const MODAL_PAGE_SIZE = 10;


  const formatNotificationTime = (isoDate: string) => {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const fetchNotificationPage = async (page: number, search: string) => {
    const trimmedSearch = search.trim();
    if (trimmedSearch) {
      return notiApiRequest.searchNotifications(trimmedSearch, page, PAGE_SIZE);
    }
    return notiApiRequest.getMyNotifications(page, PAGE_SIZE);
  };

  useEffect(() => {
    let isActive = true;

    const fetchUnreadIndicator = async () => {
      try {
        const response = await notiApiRequest.getMyNotifications(0, 10);
        const hasUnread = response.payload.data.content.some(
          (notification) => !notification.isRead,
        );

        if (isActive) {
          setHasUnreadNotifications(hasUnread);
        }
      } catch (error) {
        if (isActive) {
          setHasUnreadNotifications(false);
        }
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchUnreadIndicator();

    return () => {
      isActive = false;
    };
  }, [PAGE_SIZE]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(notificationSearch);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [notificationSearch]);

  useEffect(() => {
    if (!isNotificationOpen) {
      return;
    }

    let isActive = true;

    const loadNotifications = async () => {
      setIsNotificationLoading(true);
      setNotificationError("");

      try {
        const response = await fetchNotificationPage(
          notificationPage,
          debouncedSearch,
        );
        const list = response.payload.data.content;

        if (!isActive) {
          return;
        }

        setNotifications(list);
        setNotificationTotalPages(response.payload.data.totalPages);
        setHasUnreadNotifications(
          list.some((notification) => !notification.isRead),
        );

        if (selectedNotification) {
          const updatedSelected = list.find(
            (notification) =>
              notification.notificationId ===
              selectedNotification.notificationId,
          );
          if (updatedSelected) {
            setSelectedNotification(updatedSelected);
          }
        }
      } catch (error) {
        if (!isActive) {
          return;
        }
        setNotificationError("Khong the tai notifications.");
        console.error("Failed to load notifications", error);
      } finally {
        if (isActive) {
          setIsNotificationLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isActive = false;
    };
  }, [
    isNotificationOpen,
    notificationPage,
    debouncedSearch,
    selectedNotification,
  ]);

  useEffect(() => {
    if (!isModalOpen) return;
    let isActive = true;
    const loadModalNotifications = async () => {
      setIsModalLoading(true);
      try {
        const response = await notiApiRequest.getMyNotifications(modalPage, MODAL_PAGE_SIZE);
        if (isActive) {
          setModalNotifications(response.payload.data.content);
          setModalTotalPages(response.payload.data.totalPages);
        }
      } catch (error) {
        console.error("Failed to load modal notifications", error);
      } finally {
        if (isActive) setIsModalLoading(false);
      }
    };
    loadModalNotifications();
    return () => { isActive = false; };
  }, [isModalOpen, modalPage]);

  const handleMarkAllAsRead = async () => {
    setIsMarkAllLoading(true);
    try {
      await notiApiRequest.markAllAsRead();
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true })),
      );
      setModalNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true })),
      );
      setHasUnreadNotifications(false);
      setSelectedNotification((prev) =>
        prev ? { ...prev, isRead: true } : prev,
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    } finally {
      setIsMarkAllLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    setActionLoadingId(notificationId);
    try {
      await notiApiRequest.markAsRead(notificationId);
      setNotifications((prev) => {
        const next = prev.map((item) =>
          item.notificationId === notificationId
            ? { ...item, isRead: true }
            : item,
        );
        setHasUnreadNotifications(next.some((item) => !item.isRead));
        return next;
      });
      setModalNotifications((prev) =>
        prev.map((item) =>
          item.notificationId === notificationId
            ? { ...item, isRead: true }
            : item,
        ),
      );
      setSelectedNotification((prev) =>
        prev && prev.notificationId === notificationId
          ? { ...prev, isRead: true }
          : prev,
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleViewDetail = async (notificationId: string) => {
    setIsDetailLoadingId(notificationId);
    try {
      const response = await notiApiRequest.getNotificationById(notificationId);
      setSelectedNotification(response.payload.data);
    } catch (error) {
      console.error("Failed to fetch notification detail", error);
    } finally {
      setIsDetailLoadingId(null);
    }
  };

  return (
    <>
      <Popover.Root
      open={isNotificationOpen}
      onOpenChange={(open) => {
        setIsNotificationOpen(open);
        if (!open) {
          setSelectedNotification(null);
        }
      }}
    >
      <Popover.Trigger asChild>
        <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={20} strokeWidth={1.7} />
          {hasUnreadNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content sideOffset={8} align="end" asChild>
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="z-100 w-105 max-w-[calc(100vw-16px)] rounded-3xl bg-white border border-gray-100 shadow-2xl p-3"
          >
            <div className="flex items-center justify-between px-2">
              <p className="text-sm font-bold text-gray-800 font-[Lexend]">
                Notifications
              </p>
              <span className="text-[11px] text-gray-400">
                {notifications.length} items
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={notificationSearch}
                  onChange={(event) => {
                    setNotificationSearch(event.target.value);
                    setNotificationPage(0);
                  }}
                  placeholder="Search notifications"
                  className="h-9 w-full rounded-xl border border-gray-200 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-[#6AB04C]"
                />
              </div>
              <button
                type="button"
                title="Mark all as read"
                onClick={handleMarkAllAsRead}
                disabled={isMarkAllLoading || notifications.length === 0}
                className="h-9 w-9 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isMarkAllLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <CheckCheck size={15} />
                )}
              </button>
            </div>

            {selectedNotification && (
              <div className="mt-3 rounded-2xl border border-[#6AB04C]/25 bg-[#EBF5E4]/50 p-3">
                <p className="text-xs font-semibold text-[#3D6B2C]">
                  Notification detail
                </p>
                <p className="mt-1 text-sm font-bold text-gray-800">
                  {selectedNotification.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-gray-700">
                  {selectedNotification.message}
                </p>
                <p className="mt-2 text-[11px] text-gray-500">
                  {formatNotificationTime(selectedNotification.createdAt)}
                </p>
              </div>
            )}

            <div className="mt-3 max-h-72 overflow-y-auto pr-1 space-y-2">
              {isNotificationLoading && (
                <div className="h-24 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
                  <Loader2 size={16} className="animate-spin mr-2" /> Loading...
                </div>
              )}

              {!isNotificationLoading && notificationError && (
                <div className="h-24 rounded-2xl border border-red-100 bg-red-50 flex items-center justify-center text-red-500 text-sm px-3 text-center">
                  {notificationError}
                </div>
              )}

              {!isNotificationLoading &&
                !notificationError &&
                notifications.length === 0 && (
                  <div className="h-24 rounded-2xl flex items-center justify-center text-gray-500 text-sm">
                    No notifications found.
                  </div>
                )}

              {!isNotificationLoading &&
                !notificationError &&
                notifications.map((notification) => (
                  <div
                    key={notification.notificationId}
                    className={`rounded-2xl border p-3 transition-colors ${
                      notification.isRead
                        ? "border-gray-100 bg-white"
                        : "border-[#6AB04C]/30 bg-[#EBF5E4]/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {notification.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-gray-600 max-h-10 overflow-hidden">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-[11px] text-gray-400">
                          {formatNotificationTime(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          title="Mark as read"
                          disabled={
                            notification.isRead ||
                            actionLoadingId === notification.notificationId
                          }
                          onClick={() =>
                            handleMarkAsRead(notification.notificationId)
                          }
                          className="h-7 w-7 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {actionLoadingId === notification.notificationId ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Check size={13} />
                          )}
                        </button>
                        <button
                          type="button"
                          title="View detail"
                          disabled={
                            isDetailLoadingId === notification.notificationId
                          }
                          onClick={() =>
                            handleViewDetail(notification.notificationId)
                          }
                          className="h-7 w-7 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isDetailLoadingId === notification.notificationId ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Eye size={13} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-3 flex items-center justify-center px-1">
              <button
                type="button"
                onClick={() => {
                  setIsNotificationOpen(false);
                  setIsModalOpen(true);
                  setModalPage(0);
                }}
                className="w-full rounded-xl bg-gray-50/50 py-2.5 text-sm font-semibold text-[#6AB04C] hover:bg-[#EBF5E4]/80 transition-colors"
              >
                View all notifications
              </button>
            </div>

            <Popover.Arrow className="fill-white" />
          </motion.div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-5 border-b flex justify-between items-center bg-[#f8faf7]">
                <h2 className="text-lg font-bold text-gray-800 font-[Lexend]">All Notifications</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 p-2 text-xl leading-none">
                  ✕
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-gray-50/50">
                {isModalLoading ? (
                  <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gray-400" /></div>
                ) : (
                  modalNotifications.length === 0 ? (
                    <div className="flex justify-center text-gray-500 py-10">No notifications found.</div>
                  ) : (
                    modalNotifications.map(notification => (
                      <div
                        key={notification.notificationId}
                        className={`rounded-2xl border p-4 transition-colors ${
                          notification.isRead
                            ? "border-gray-200 bg-white"
                            : "border-[#6AB04C]/30 bg-[#EBF5E4]/60"
                        }`}
                      >
                         <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-800">
                                {notification.title}
                              </p>
                              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                                {notification.message}
                              </p>
                              <p className="mt-2 text-xs text-gray-400">
                                {formatNotificationTime(notification.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                title="Mark as read"
                                disabled={
                                  notification.isRead ||
                                  actionLoadingId === notification.notificationId
                                }
                                onClick={() =>
                                  handleMarkAsRead(notification.notificationId)
                                }
                                className="h-8 w-8 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                              >
                                {actionLoadingId === notification.notificationId ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Check size={14} />
                                )}
                              </button>
                            </div>
                          </div>
                      </div>
                    ))
                  )
                )}
              </div>
              <div className="p-4 border-t flex justify-between items-center bg-white">
                <button
                  type="button"
                  onClick={() => setModalPage((prev) => Math.max(0, prev - 1))}
                  disabled={modalPage === 0 || isModalLoading}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {modalTotalPages === 0 ? 0 : modalPage + 1} of {modalTotalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setModalPage((prev) =>
                      modalTotalPages > 0
                        ? Math.min(modalTotalPages - 1, prev + 1)
                        : prev,
                    )
                  }
                  disabled={
                    modalTotalPages === 0 ||
                    modalPage >= modalTotalPages - 1 ||
                    isModalLoading
                  }
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
