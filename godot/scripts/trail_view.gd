class_name TrailView
extends Control

const BACKGROUNDS := [
	"res://assets/sprites/scene/waterfall.png",
	"res://assets/sprites/scene/spring.png",
	"res://assets/sprites/scene/moose-birches.png",
	"res://assets/sprites/scene/blueberry-slope.png",
	"res://assets/sprites/scene/fisherman-lake.png",
	"res://assets/backgrounds/poi-t1-06-vuolle-overlook.jpg",
]
const ROUTE := [Vector2(.13,.74),Vector2(.27,.61),Vector2(.41,.67),Vector2(.54,.47),Vector2(.69,.35),Vector2(.84,.19)]

var poi := 0
var walking := false
var time := 0.0
var background: Texture2D
var map_texture: Texture2D
var hiker: CharacterPreview

func _ready() -> void:
	clip_contents = true
	map_texture = load("res://assets/maps/stage-map-1.png")
	hiker = CharacterPreview.new()
	hiker.set_anchors_preset(Control.PRESET_TOP_LEFT)
	hiker.size = Vector2(78, 78)
	add_child(hiker)
	resized.connect(_place_hiker)
	_place_hiker()
	set_process(true)

func _place_hiker() -> void:
	if hiker: hiker.position = Vector2(size.x - 82, size.y - 88)

func configure(next_poi: int, is_walking: bool) -> void:
	poi = clampi(next_poi, 0, 5)
	walking = is_walking
	background = load(BACKGROUNDS[poi])
	if hiker:
		hiker.configure(GameState.person, bool(GameState.gear.poles), walking)
	queue_redraw()

func _process(delta: float) -> void:
	time += delta
	queue_redraw()

func _draw() -> void:
	if background:
		var drift := Vector2(sin(time * .13) * 4.0, cos(time * .11) * 2.5)
		draw_texture_rect(background, Rect2(Vector2(-8,-6) + drift, size + Vector2(16,12)), false)
	_draw_ambient()
	var map_rect := Rect2(size.x - 179, size.y - 126, 174, 116)
	if map_texture: draw_texture_rect(map_texture, map_rect, false)
	var scaled := PackedVector2Array()
	for point in ROUTE: scaled.append(map_rect.position + point * map_rect.size)
	var completed := PackedVector2Array()
	for index in range(min(poi + 1, scaled.size())): completed.append(scaled[index])
	if completed.size() > 1: draw_polyline(completed, Color("#9b321d"), 4.0, true)
	if completed.size() > 0:
		draw_circle(completed[-1], 6.0, Color("#e2a53b"))
		draw_arc(completed[-1], 6.0, 0, TAU, 20, Color("#43352d"), 2.0, true)

func _draw_ambient() -> void:
	match poi:
		0:
			for i in range(8):
				var x := 44.0 + i * 13.0 + sin(time * 1.8 + i) * 4.0
				var y := fmod(time * (45.0 + i * 3.0) + i * 31.0, size.y * .72)
				draw_line(Vector2(x,y-20),Vector2(x-5,y+17),Color(0.83,0.94,0.95,.62),3.0)
			for i in range(5):
				var center := Vector2(70 + i*24 + sin(time+i)*12, 208 + cos(time*.7+i)*7)
				draw_circle(center, 11+i*2, Color(0.93,0.94,0.88,.12))
		1:
			for i in range(6):
				var radius := 8.0 + fmod(time * 18.0 + i*13.0, 48.0)
				draw_arc(Vector2(145+i*24,190+i%2*13),radius,0,TAU,32,Color(0.78,0.91,0.90,.5)*(1.0-radius/65.0),2.0)
		2:
			for i in range(18):
				var lx := fmod(i*41.0 + time*(13+i%3*3), size.x+30)-15
				var ly := 28+i%7*25+sin(time*1.4+i)*15
				draw_colored_polygon(PackedVector2Array([Vector2(lx,ly-7),Vector2(lx+7,ly),Vector2(lx,ly+6),Vector2(lx-5,ly)]),Color("#b0923d" if i%2 else "#596b3e"))
		3:
			for i in range(9):
				var glow := .25 + maxf(0.0, sin(time*2.0+i))*.6
				draw_circle(Vector2(40+i*39,175+i%3*19),3.5,Color(0.75,0.84,1.0,glow))
		4:
			for i in range(10):
				var yy := 140+i*9+sin(time*1.2+i)*3
				draw_line(Vector2(16+i%2*24,yy),Vector2(235-i%3*18,yy),Color(0.88,0.91,0.83,.34),1.5)
			var bx := fmod(time*18.0, size.x+70)-35
			draw_arc(Vector2(bx,62),10,PI,TAU,8,Color("#302b27"),2.0)
			draw_arc(Vector2(bx+20,62),10,PI,TAU,8,Color("#302b27"),2.0)
		5:
			for i in range(4):
				var cx := fmod(time*(9+i*2)+i*120.0,size.x+140)-70
				var cy := 42+i%2*34
				draw_circle(Vector2(cx,cy),30,Color(0.94,0.91,0.82,.28))
				draw_circle(Vector2(cx+28,cy+4),23,Color(0.94,0.91,0.82,.25))
