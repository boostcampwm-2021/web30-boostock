import { toast, ToastContent, ToastOptions } from 'react-toastify';
import { MAX_NUM_OF_TOAST_MESSAGES } from '@common/constants';

class Toast {
	#queueLength;

	constructor() {
		this.#queueLength = 0;
	}

	#checkAndClearQueue() {
		if (this.#queueLength < MAX_NUM_OF_TOAST_MESSAGES) return;
		toast.clearWaitingQueue();
		this.#resetQueueLength();
	}

	#increaseQueueLength() {
		this.#queueLength += 1;
	}

	#resetQueueLength() {
		this.#queueLength = 0;
	}

	default(msg: ToastContent, options?: ToastOptions<Record<string, unknown>>) {
		this.#checkAndClearQueue();
		toast(msg, options);
		this.#increaseQueueLength();
	}

	info(msg: ToastContent, options?: ToastOptions<Record<string, unknown>>) {
		this.#checkAndClearQueue();
		toast.info(msg, options);
		this.#increaseQueueLength();
	}

	success(msg: ToastContent, options?: ToastOptions<Record<string, unknown>>) {
		this.#checkAndClearQueue();
		toast.success(msg, options);
		this.#increaseQueueLength();
	}

	warning(msg: ToastContent, options?: ToastOptions<Record<string, unknown>>) {
		this.#checkAndClearQueue();
		toast.warning(msg, options);
		this.#increaseQueueLength();
	}

	error(msg: ToastContent, options?: ToastOptions<Record<string, unknown>>) {
		this.#checkAndClearQueue();
		toast.error(msg, options);
		this.#increaseQueueLength();
	}
}

const TOAST = new Toast();
export default TOAST;
