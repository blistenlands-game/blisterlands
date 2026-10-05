class_name ChoiceIcon
extends Control

var kind := "speak"
var accent := Color("#8f3d22")

func setup(next_kind: String, next_color: Color) -> ChoiceIcon:
	kind = next_kind
	accent = next_color
	custom_minimum_size = Vector2(38, 38)
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	queue_redraw()
	return self

func _draw() -> void:
	match kind:
		"speak":
			draw_arc(Vector2(17, 16), 10, .2, TAU - .15, 28, accent, 2.1, true)
			draw_polyline(PackedVector2Array([Vector2(10,24), Vector2(7,30), Vector2(15,26)]), accent, 2.1, true)
		"scatter":
			draw_polyline(PackedVector2Array([Vector2(5,20), Vector2(13,13), Vector2(25,14), Vector2(31,10)]), accent, 3.2, true)
			draw_line(Vector2(12,15), Vector2(9,10), accent, 2.2, true)
			for point in [Vector2(12,28), Vector2(21,25), Vector2(28,30)]: draw_circle(point, 2.2, accent)
		"avoid":
			draw_arc(Vector2(18,18), 10, .25, PI - .25, 20, accent, 2.2, true)
			draw_arc(Vector2(18,18), 10, PI + .25, TAU - .25, 20, accent, 2.2, true)
			draw_circle(Vector2(18,18), 3.0, accent)
			draw_line(Vector2(6,30), Vector2(31,6), accent, 3.0, true)

