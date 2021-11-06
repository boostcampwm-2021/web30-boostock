export default function caretIcon(percent: number): string {
	if (percent < 0) return '▼';
	if (percent > 0) return '▲';
	return '';
}
