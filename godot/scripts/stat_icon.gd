class_name StatIcon
extends Control

var kind := "sun"
var accent := Color("#e5ae3e")

func setup(next_kind: String, next_color: Color) -> StatIcon:
	kind = next_kind
	accent = next_color
	custom_minimum_size = Vector2(26, 26)
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	queue_redraw()
	return self

func _draw() -> void:
	var icon_scale := minf(size.x, size.y) / 18.0
	draw_set_transform((size - Vector2(18, 18) * icon_scale) * .5, 0.0, Vector2.ONE * icon_scale)
	match kind:
		"sun": _sun()
		"bolt": _bolt()
		"heart": _heart()
		"coins": _coins()
		"steam": _steam()
		"boot": _boot()

func _sun() -> void:
	var center := Vector2(9, 9)
	draw_circle(center, 4.0, accent)
	for index in range(8):
		var direction := Vector2.RIGHT.rotated(index * TAU / 8.0)
		draw_line(center + direction * 6.0, center + direction * 8.2, accent, 1.4, true)

func _bolt() -> void:
	draw_colored_polygon(PackedVector2Array([
		Vector2(10, 0), Vector2(4, 10), Vector2(8, 10),
		Vector2(6, 18), Vector2(15, 7), Vector2(11, 7)
	]), accent)

func _heart() -> void:
	draw_circle(Vector2(6.0, 6.4), 4.0, accent)
	draw_circle(Vector2(12.0, 6.4), 4.0, accent)
	draw_colored_polygon(PackedVector2Array([
		Vector2(2.2, 7), Vector2(15.8, 7), Vector2(9, 17)
	]), accent)

func _coins() -> void:
	for index in range(3):
		var y := 5.0 + index * 4.2
		draw_circle(Vector2(9, y), 5.0, accent)
		draw_arc(Vector2(9, y), 5.0, 0, TAU, 20, Color("#8b5b1b"), 1.0, true)

func _steam() -> void:
	for index in range(3):
		var x := 4.0 + index * 5.0
		draw_polyline(PackedVector2Array([
			Vector2(x, 16), Vector2(x - 1, 12), Vector2(x + 1, 9),
			Vector2(x, 5), Vector2(x + 1, 2)
		]), accent, 1.8, true)

func _boot() -> void:
	draw_colored_polygon(PackedVector2Array([
		Vector2(5,2), Vector2(12,2), Vector2(12,10), Vector2(16,12),
		Vector2(16,16), Vector2(3,16), Vector2(3,12), Vector2(7,10)
	]), accent)
	for y in [5.0, 8.0, 11.0]: draw_line(Vector2(6,y), Vector2(11,y), Color("#704d25"), .8, true)
