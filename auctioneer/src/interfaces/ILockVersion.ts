type Lockversion =
	| 'pessimistic_read'
	| 'pessimistic_write'
	| 'dirty_read'
	| 'pessimistic_partial_write'
	| 'pessimistic_write_or_fail'
	| 'for_no_key_update';
export default Lockversion;
