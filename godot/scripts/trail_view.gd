class_name TrailView
extends Control

const BACKGROUNDS := [
	"res://assets/godot/poi-t1-waterfall-v1.png",
	"res://assets/sprites/scene/spring.png",
	"res://assets/sprites/scene/moose-birches.png",
	"res://assets/sprites/scene/blueberry-slope.png",
	"res://assets/sprites/scene/fisherman-lake.png",
	"res://assets/backgrounds/poi-t1-06-vuolle-overlook.jpg",
]
const ROUTE := [
	Vector2(.125,.79), Vector2(.263,.594), Vector2(.40,.715),
	Vector2(.525,.466), Vector2(.674,.343), Vector2(.863,.134),
]
const INK := Color("#302822")
const PAPER := Color("#f3ead8")
const RUST := Color("#9b321d")

var poi := 0
var walking := false
var time := 0.0
var walk_elapsed := 0.0
var background: Texture2D
var map_texture: Texture2D
var hiker: CharacterPreview

func _ready() -> void:
	clip_contents = true
	map_texture = load("res://assets/maps/stage-map-1.png")
	hiker = CharacterPreview.new()
	hiker.set_anchors_preset(Control.PRESET_TOP_LEFT)
	hiker.size = Vector2(86, 86)
	hiker.mirrored = true
	add_child(hiker)
	_create_title()
	resized.connect(_place_hiker)
	_place_hiker()
	set_process(true)

func _create_title() -> void:
	var panel := PanelContainer.new()
	panel.position = Vector2(12, 12)
	panel.size = Vector2(292, 74)
	var style := StyleBoxFlat.new()
	style.bg_color = Color(PAPER, .94)
	style.set_corner_radius_all(12)
	style.content_margin_left = 13
	style.content_margin_right = 13
	style.content_margin_top = 7
	style.content_margin_bottom = 7
	panel.add_theme_stylebox_override("panel", style)
	var column := VBoxContainer.new()
	column.add_theme_constant_override("separation", 0)
	var title := Label.new()
	title.text = "Tappa 1"
	title.add_theme_font_size_override("font_size", 29)
	title.add_theme_color_override("font_color", INK)
	var handwritten := SystemFont.new()
	handwritten.font_names = PackedStringArray(["Caveat", "Segoe Print", "Comic Sans MS"])
	handwritten.font_weight = 700
	title.add_theme_font_override("font", handwritten)
	column.add_child(title)
	var subtitle := Label.new()
	subtitle.text = "La Cascata di Lavvu · 14 km"
	subtitle.add_theme_font_size_override("font_size", 14)
	subtitle.add_theme_color_override("font_color", Color("#67594f"))
	column.add_child(subtitle)
	panel.add_child(column)
	add_child(panel)

func _map_rect() -> Rect2:
	var width := minf(138.0, size.x * .34)
	var height := width * 530.0 / 800.0
	return Rect2(size.x-width-7.0, size.y-height-6.0, width, height)

func _place_hiker() -> void:
	if not hiker: return
	var map_rect := _map_rect()
	hiker.position = Vector2(size.x-hiker.size.x-1.0, map_rect.end.y-hiker.size.y)

func configure(next_poi: int, is_walking: bool) -> void:
	poi = clampi(next_poi, 0, 5)
	walking = is_walking
	if walking: walk_elapsed = 0.0
	background = load(BACKGROUNDS[poi])
	if hiker:
		hiker.mirrored = true
		hiker.configure(GameState.person, bool(GameState.gear.poles), walking)
	queue_redraw()

func _process(delta: float) -> void:
	time += delta
	if walking: walk_elapsed = minf(4.2, walk_elapsed + delta)
	queue_redraw()

func _draw() -> void:
	if background:
		var drift := Vector2(sin(time * .16) * 2.2, cos(time * .12) * 1.2)
		var target_size := size + Vector2(10,8)
		var texture_size := background.get_size()
		var cover_scale := maxf(target_size.x/texture_size.x, target_size.y/texture_size.y)
		var source_size := target_size/cover_scale
		var source_position := (texture_size-source_size)*.5
		draw_texture_rect_region(background, Rect2(Vector2(-5,-4)+drift,target_size), Rect2(source_position,source_size))
	_draw_cloud_shadows()
	_draw_waterfall_motion()
	_draw_pool_motion()
	_draw_vegetation_motion()
	var map_rect := _map_rect()
	if map_texture: draw_texture_rect(map_texture, map_rect, false)
	_draw_route_progress(map_rect)

func _draw_cloud_shadows() -> void:
	for index in range(3):
		var x := fmod(time * (5.0 + index) + index * 170.0, size.x + 220.0) - 110.0
		var center := Vector2(x, 118.0 + index * 54.0)
		draw_circle(center, 64.0 + index * 12.0, Color(0.20, 0.27, 0.30, .035))
		draw_circle(center + Vector2(52,8), 48.0, Color(0.20, 0.27, 0.30, .025))

func _draw_waterfall_motion() -> void:
	if poi != 0: return
	for index in range(13):
		var phase := fmod(time * (42.0 + index * 2.0) + index * 19.0, 126.0)
		var x := 82.0 + index * 8.2 + sin(time * 1.4 + index) * 2.4
		var top := 101.0 + phase * .30
		var length := 17.0 + index % 4 * 4.0
		draw_line(Vector2(x, top), Vector2(x-4.0, top+length), Color(0.86,0.95,0.96,.36), 2.2, true)
	for index in range(8):
		var spray_x := 95.0 + index * 13.0 + sin(time * 2.1 + index) * 8.0
		var spray_y := 217.0 + cos(time * 1.7 + index) * 6.0
		draw_circle(Vector2(spray_x,spray_y), 3.0 + index % 3, Color(0.91,0.96,0.95,.24))

func _draw_pool_motion() -> void:
	if poi != 0: return
	for index in range(6):
		var pulse := fmod(time * 17.0 + index * 18.0, 54.0)
		var alpha := maxf(0.0, .32 - pulse / 190.0)
		var center := Vector2(139.0 + index * 25.0, 248.0 + index % 2 * 13.0)
		draw_arc(center, 9.0+pulse*.55, PI*.08, PI*.92, 24, Color(0.83,0.94,0.92,alpha), 1.4, true)
	for index in range(5):
		var glint_x := fmod(time * (18.0+index) + index*77.0, size.x*.66)
		var glint_y := 242.0 + index*12.0
		draw_line(Vector2(glint_x,glint_y),Vector2(glint_x+12,glint_y),Color(1,1,.87,.28),1.4)

func _draw_vegetation_motion() -> void:
	if poi != 0: return
	for index in range(11):
		var base := Vector2(18.0 + index * 36.0, 319.0 - index % 3 * 10.0)
		var sway := sin(time * 1.15 + index * .73) * 3.5
		draw_line(base, base+Vector2(sway,-13.0-index%2*4.0), Color(0.24,0.31,0.15,.42), 1.5, true)

func _curve_points(map_rect: Rect2) -> PackedVector2Array:
	var control := PackedVector2Array()
	for point in ROUTE: control.append(map_rect.position + point * map_rect.size)
	var smooth := PackedVector2Array()
	for segment in range(control.size()-1):
		var p0 := control[maxi(0, segment-1)]
		var p1 := control[segment]
		var p2 := control[segment+1]
		var p3 := control[mini(control.size()-1, segment+2)]
		for step in range(13):
			var t := step / 12.0
			var t2 := t*t
			var t3 := t2*t
			smooth.append(.5*((2.0*p1)+(-p0+p2)*t+(2.0*p0-5.0*p1+4.0*p2-p3)*t2+(-p0+3.0*p1-3.0*p2+p3)*t3))
	return smooth

func _draw_route_progress(map_rect: Rect2) -> void:
	var smooth := _curve_points(map_rect)
	if smooth.size() < 2: return
	var segment_fraction := clampf(walk_elapsed/4.2, 0.0, 1.0) if walking else 0.0
	var total_fraction := clampf((poi + segment_fraction)/5.0, 0.0, 1.0)
	var last_index := clampi(int(total_fraction*(smooth.size()-1)), 0, smooth.size()-1)
	var complete := PackedVector2Array()
	for index in range(last_index+1): complete.append(smooth[index])
	if complete.size() > 1: draw_polyline(complete, RUST, 3.2, true)
	var marker := smooth[last_index]
	draw_circle(marker, 4.5, Color("#e2a53b"))
	draw_arc(marker, 4.5, 0, TAU, 20, Color("#43352d"), 1.4, true)
