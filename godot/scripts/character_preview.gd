class_name CharacterPreview
extends Control

var person := "marco"
var poles := false
var walking := false
var mirrored := false
var frame := 0
var elapsed := 0.0
var frame_duration := .27
var texture: Texture2D

func configure(next_person: String, next_poles: bool, is_walking: bool) -> void:
	person = next_person
	poles = next_poles
	walking = is_walking
	var folder := "walk-poles" if poles else "walk"
	texture = load("res://assets/sprites/%s/%s.png" % [folder, person])
	frame = 0
	elapsed = 0.0
	queue_redraw()

func _process(delta: float) -> void:
	if walking:
		elapsed += delta
		if elapsed >= frame_duration:
			elapsed = fmod(elapsed, frame_duration)
			frame = (frame + 1) % 4
			queue_redraw()

func _draw() -> void:
	if texture == null: return
	var source := Rect2(frame * 256, 0, 256, 256)
	var destination := Rect2(0, 0, size.x, size.y)
	if mirrored:
		draw_set_transform(Vector2(size.x, 0), 0.0, Vector2(-1, 1))
		destination = Rect2(0, 0, size.x, size.y)
	draw_texture_rect_region(texture, destination, source)
	if mirrored: draw_set_transform(Vector2.ZERO)
