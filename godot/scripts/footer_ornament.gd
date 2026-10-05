class_name FooterOrnament
extends Control

var kind := "sprig"
var ink := Color("#8d735b88")

func setup(next_kind: String) -> FooterOrnament:
	kind = next_kind
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	queue_redraw()
	return self

func _draw() -> void:
	if kind == "mountains":
		draw_polyline(PackedVector2Array([Vector2(3,27),Vector2(17,8),Vector2(27,22),Vector2(36,12),Vector2(51,29)]), ink, 1.5, true)
		draw_line(Vector2(17,8),Vector2(20,17),ink,1.2,true)
		draw_line(Vector2(36,12),Vector2(33,20),ink,1.2,true)
		return
	draw_line(Vector2(10,48), Vector2(30,5), ink, 1.2, true)
	for index in range(7):
		var base := Vector2(12 + index * 2.5, 43 - index * 5.3)
		var side := -1.0 if index % 2 == 0 else 1.0
		draw_line(base, base + Vector2(side * 11, -7), ink, 1.0, true)
		draw_arc(base + Vector2(side * 11, -7), 4, 0, TAU, 12, ink, 1.0, true)
