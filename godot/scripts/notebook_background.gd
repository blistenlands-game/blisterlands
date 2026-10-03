extends Control

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	queue_redraw()

func _draw() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color("#eee2c8"))
	for y in range(36, int(size.y), 32):
		draw_line(Vector2(0, y), Vector2(size.x, y), Color("#9ab4b3", .42), 1.0)
	draw_line(Vector2(35, 0), Vector2(35, size.y), Color("#c77d6c", .42), 1.4)
	var edge := Color("#8f7655", .13)
	draw_rect(Rect2(0, 0, 7, size.y), edge)
	draw_rect(Rect2(size.x - 7, 0, 7, size.y), edge)

