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
	var side := minf(size.x, size.y)
	var bob := sin(elapsed * 14.0) * 1.6 if walking else 0.0
	var destination := Rect2((size.x-side)*.5, size.y-side+bob, side, side)
	if mirrored:
		draw_set_transform(Vector2(size.x, 0), 0.0, Vector2(-1, 1))
	draw_texture_rect_region(texture, destination, source)
	if mirrored: draw_set_transform(Vector2.ZERO)
