extends Node3D

const SKY := Color("#182724")
const INK := Color("#272724")
const PAPER := Color("#f1e5c9")
const RUST := Color("#9b3d18")
const PATH_POINTS := [
	Vector3(3.75,.48,3.5), Vector3(2.55,.49,2.35), Vector3(1.15,.50,1.15),
	Vector3(.15,.51,-.15), Vector3(-1.15,.56,-1.15), Vector3(-2.15,.82,-2.15),
]

var hiker: Node3D
var left_leg: Node3D
var right_leg: Node3D
var left_arm: Node3D
var right_arm: Node3D
var tree_crowns: Array[Node3D] = []
var clouds: Array[Node3D] = []
var mist: Array[Node3D] = []
var walking := false
var walk_time := 0.0
var total_time := 0.0
var walk_button: Button
var status_label: Label
var outline_material: ShaderMaterial
var scene_camera: Camera3D

func _ready() -> void:
	RenderingServer.set_default_clear_color(SKY)
	outline_material = _make_outline_material()
	_build_environment()
	_build_landscape()
	_build_hiker()
	_build_ui()
	set_process(true)

func _process(delta: float) -> void:
	total_time += delta
	_animate_environment()
	if walking:
		walk_time = minf(walk_time + delta, 6.0)
		var progress := ease(walk_time / 6.0, -1.15)
		var position_and_direction := _sample_route(progress)
		hiker.position = position_and_direction[0] + Vector3(0, absf(sin(walk_time*7.5))*.055, 0)
		hiker.look_at(hiker.position + position_and_direction[1], Vector3.UP)
		var stride := sin(walk_time * 7.5)
		left_leg.rotation.x = stride * .58
		right_leg.rotation.x = -stride * .58
		left_arm.rotation.x = -stride * .48
		right_arm.rotation.x = stride * .48
		if walk_time >= 6.0:
			walking = false
			walk_button.disabled = false
			walk_button.text = "Riparti"
			status_label.text = "Arrivato al primo punto di interesse"
	else:
		left_leg.rotation.x = lerpf(left_leg.rotation.x, 0.0, minf(1.0,delta*8.0))
		right_leg.rotation.x = lerpf(right_leg.rotation.x, 0.0, minf(1.0,delta*8.0))
		left_arm.rotation.x = lerpf(left_arm.rotation.x, 0.0, minf(1.0,delta*8.0))
		right_arm.rotation.x = lerpf(right_arm.rotation.x, 0.0, minf(1.0,delta*8.0))

func _build_environment() -> void:
	var world := WorldEnvironment.new()
	var environment := Environment.new()
	environment.background_mode = Environment.BG_COLOR
	environment.background_color = SKY
	environment.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	environment.ambient_light_color = Color("#9aab9c")
	environment.ambient_light_energy = .38
	environment.tonemap_mode = Environment.TONE_MAPPER_FILMIC
	environment.adjustment_enabled = true
	environment.adjustment_brightness = .9
	environment.adjustment_saturation = .82
	world.environment = environment
	add_child(world)

	var sun := DirectionalLight3D.new()
	sun.rotation_degrees = Vector3(-52,-38,0)
	sun.light_color = Color("#ffe2ad")
	sun.light_energy = 1.05
	sun.shadow_enabled = true
	sun.directional_shadow_max_distance = 28
	add_child(sun)

	scene_camera = Camera3D.new()
	scene_camera.projection = Camera3D.PROJECTION_ORTHOGONAL
	scene_camera.size = 14.2
	scene_camera.position = Vector3(10.8,9.4,14.8)
	scene_camera.look_at_from_position(scene_camera.position, Vector3(0,.55,-.15), Vector3.UP)
	scene_camera.current = true
	add_child(scene_camera)

func _build_landscape() -> void:
	# Un quadro unico e leggibile: zolla di tundra ritagliata, come un plastico da tavolo.
	var base := BoxMesh.new(); base.size = Vector3(11.2,1.35,9.5)
	_add_mesh(base,Vector3(0,-.63,0),Vector3.ZERO,Vector3.ONE,_toon(Color("#3d4140"),false))
	var earth := BoxMesh.new(); earth.size = Vector3(10.95,.72,9.28)
	_add_mesh(earth,Vector3(0,.08,0),Vector3.ZERO,Vector3.ONE,_toon(Color("#66513d"),false))
	var turf := BoxMesh.new(); turf.size = Vector3(10.82,.24,9.15)
	_add_mesh(turf,Vector3(0,.45,0),Vector3.ZERO,Vector3.ONE,_toon(Color("#758b55"),false))
	# Strati glaciali sui fianchi della zolla.
	for y in [-.98,-.72,-.46]:
		var seam := BoxMesh.new(); seam.size=Vector3(11.24,.055,9.54)
		_add_mesh(seam,Vector3(0,y,0),Vector3.ZERO,Vector3.ONE,_toon(Color("#59605e"),false))

	# Ruscello sinuoso: nasce dietro il salto e attraversa tutto il quadro.
	var river_points := [
		Vector3(-2.35,.59,-4.48),Vector3(-2.28,.59,-3.55),Vector3(-2.18,.58,-2.42),
		Vector3(-1.58,.57,-1.65),Vector3(-.55,.56,-.82),Vector3(.38,.56,.15),
		Vector3(.55,.56,1.22),Vector3(1.3,.56,2.22),Vector3(1.75,.56,4.45),
	]
	_add_mesh(_ribbon(river_points,1.12),Vector3.ZERO,Vector3.ZERO,Vector3.ONE,_water_material(false))

	var path_material := _toon(Color("#9a784b"), false)
	_add_mesh(_ribbon(PATH_POINTS, .46), Vector3(0,.06,0), Vector3.ZERO, Vector3.ONE, path_material)
	var walked_material := _toon(RUST, false)
	var walked := _add_mesh(_ribbon([PATH_POINTS[0],PATH_POINTS[1]], .10), Vector3(0,.075,0), Vector3.ZERO, Vector3.ONE, walked_material)
	walked.name = "RouteProgress"

	# Il salto di Lavvu, incassato fra massi glaciali e betulle basse.
	var shelf := BoxMesh.new(); shelf.size=Vector3(4.4,.62,2.15)
	_add_mesh(shelf,Vector3(-2.25,.73,-3.55),Vector3.ZERO,Vector3.ONE,_toon(Color("#667c4d"),false))
	for rock in [
		["stone_largeA",Vector3(-3.65,.62,-2.55),Vector3(1.7,1.65,1.5),.15],
		["stone_largeB",Vector3(-.92,.60,-2.55),Vector3(1.65,1.55,1.5),-.2],
		["stone_largeB",Vector3(-3.35,.65,-3.85),Vector3(1.25,1.35,1.2),.4],
		["stone_largeA",Vector3(-1.12,.65,-3.95),Vector3(1.2,1.4,1.2),-.35],
	]:
		_add_asset(rock[0],rock[1],Vector3(0,rock[3],0),rock[2])
	var falls := QuadMesh.new(); falls.size = Vector2(1.22,1.32)
	_add_mesh(falls,Vector3(-2.2,1.03,-2.43),Vector3.ZERO,Vector3.ONE,_water_material(true))
	_add_asset("bridge_wood",Vector3(-.15,.68,-.2),Vector3(0,-.72,0),Vector3(1.5,1.15,1.35))

	for index in range(18):
		var x := -4.65 + fmod(index*2.31,9.2)
		var z := -3.95 + fmod(index*3.17,7.7)
		if Vector2(x+.4,z+.2).length() < 1.4: continue
		var rock_name: String = ["rock_largeA","rock_largeB","rock_largeC"][index%3]
		_add_asset(rock_name,Vector3(x,.58,z),Vector3(0,index*.63,0),Vector3.ONE*(.42+index%4*.12))

	# Vegetazione rada, bassa e piegata dal vento: niente foresta alpina fitta.
	for index in range(13):
		var x := -4.65 + fmod(index*2.87,9.25)
		var z := -3.9 + fmod(index*4.11,7.85)
		if Vector2(x+.2,z).length() < 1.5: continue
		var tree_name: String = ["tree_pineSmallA","tree_pineSmallB","tree_pineRoundA"][index%3]
		var tree := _add_asset(tree_name,Vector3(x,.56,z),Vector3(0,index*.73,0),Vector3.ONE*(.72+index%3*.12))
		tree_crowns.append(tree)

	for index in range(24):
		var bush_name := "plant_bushDetailed" if index%3==0 else "plant_bushSmall"
		_add_asset(bush_name,Vector3(-4.65+fmod(index*2.17,9.15),.57,-3.9+fmod(index*3.61,7.65)),Vector3(0,index*.8,0),Vector3.ONE*(.48+index%3*.12))
	for index in range(30):
		var grass_name := "plant_flatTall" if index%4==0 else "plant_flatShort"
		_add_asset(grass_name,Vector3(-4.55+fmod(index*1.73,9.0),.57,-3.8+fmod(index*2.39,7.45)),Vector3(0,index*.9,0),Vector3.ONE*(.52+index%3*.12))

	_add_cloud(Vector3(-4.8,5.3,-7.0), .72)
	_add_cloud(Vector3(.5,5.8,-7.5), .58)
	_add_cloud(Vector3(4.6,4.9,-6.8), .5)
	for index in range(10):
		var puff := _add_mesh(_sphere(.22,7,4), Vector3(-2.65+index*.10,.72+index%3*.07,-2.18+index%2*.08), Vector3.ZERO, Vector3.ONE, _mist_material())
		mist.append(puff)

func _add_asset(asset_name: String, position: Vector3, rotation: Vector3, asset_scale: Vector3) -> Node3D:
	var packed := load("res://assets/third_party/kenney_nature/%s.glb" % asset_name) as PackedScene
	var instance := packed.instantiate() as Node3D
	instance.position = position
	instance.rotation = rotation
	instance.scale = asset_scale
	add_child(instance)
	return instance

func _build_hiker() -> void:
	hiker = Node3D.new()
	hiker.name = "Hiker"
	hiker.position = PATH_POINTS[0]
	hiker.scale = Vector3.ONE*.68
	add_child(hiker)
	var coat := _toon(Color("#8d9469"),false)
	var dark := _toon(Color("#303638"),false)
	var leather := _toon(Color("#6f442f"),false)
	var skin := _toon(Color("#c47d55"),false)
	var orange := _toon(Color("#b84725"),false)
	var green := _toon(Color("#4e5942"),false)

	var torso := BoxMesh.new(); torso.size = Vector3(.82,1.0,.48)
	_add_mesh(torso, Vector3(0,1.48,0), Vector3.ZERO, Vector3.ONE, coat, hiker)
	var head := _sphere(.34,8,5)
	_add_mesh(head, Vector3(0,2.22,-.02), Vector3.ZERO, Vector3(1,.92,1), skin, hiker)
	var nose := CylinderMesh.new(); nose.top_radius=0.0; nose.bottom_radius=.11; nose.height=.30; nose.radial_segments=5
	_add_mesh(nose, Vector3(.0,2.22,-.33), Vector3(PI/2,0,0), Vector3.ONE, skin, hiker)
	var beanie := CylinderMesh.new(); beanie.top_radius=.28; beanie.bottom_radius=.37; beanie.height=.35; beanie.radial_segments=8
	_add_mesh(beanie, Vector3(0,2.52,0), Vector3.ZERO, Vector3.ONE, green, hiker)

	var backpack := BoxMesh.new(); backpack.size=Vector3(.86,.92,.38)
	_add_mesh(backpack, Vector3(0,1.53,.39), Vector3.ZERO, Vector3.ONE, dark, hiker)
	var roll := CylinderMesh.new(); roll.top_radius=.23; roll.bottom_radius=.23; roll.height=.83; roll.radial_segments=8
	_add_mesh(roll, Vector3(0,1.98,.43), Vector3(0,0,PI/2), Vector3.ONE, orange, hiker)

	left_leg = _limb_pivot(Vector3(-.23,1.03,0), hiker)
	right_leg = _limb_pivot(Vector3(.23,1.03,0), hiker)
	_add_leg(left_leg, dark, leather)
	_add_leg(right_leg, dark, leather)
	left_arm = _limb_pivot(Vector3(-.51,1.78,0), hiker)
	right_arm = _limb_pivot(Vector3(.51,1.78,0), hiker)
	_add_arm(left_arm, coat, leather, -1.0)
	_add_arm(right_arm, coat, leather, 1.0)
	hiker.look_at(PATH_POINTS[1],Vector3.UP)

func _build_ui() -> void:
	var layer := CanvasLayer.new()
	add_child(layer)
	var top := PanelContainer.new()
	top.position = Vector2(18,18)
	top.size = Vector2(318,78)
	top.add_theme_stylebox_override("panel", _panel_style(Color(PAPER,.94), 14))
	var top_column := VBoxContainer.new()
	var title := _ui_label("La Cascata di Lavvu", 27, INK, true)
	var subtitle := _ui_label("Tappa 1 · POI 1 di 6", 14, Color("#655a4f"))
	top_column.add_child(title); top_column.add_child(subtitle); top.add_child(top_column); layer.add_child(top)

	var bottom := PanelContainer.new()
	bottom.set_anchors_preset(Control.PRESET_BOTTOM_WIDE)
	bottom.offset_left = 14; bottom.offset_right = -14; bottom.offset_top = -172; bottom.offset_bottom = -14
	bottom.add_theme_stylebox_override("panel", _panel_style(Color(PAPER,.96), 15))
	var column := VBoxContainer.new()
	column.add_theme_constant_override("separation", 7)
	status_label = _ui_label("Il sentiero risale l'acqua fra rocce glaciali e betulle basse.", 15, Color("#5e554c"))
	status_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	column.add_child(status_label)
	var stats := _ui_label("10:30    energia 100    morale 72", 17, INK, true)
	stats.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	column.add_child(stats)
	walk_button = Button.new()
	walk_button.text = "Cammina"
	walk_button.custom_minimum_size.y = 52
	walk_button.add_theme_font_size_override("font_size", 22)
	walk_button.add_theme_color_override("font_color", Color.WHITE)
	walk_button.add_theme_stylebox_override("normal", _panel_style(RUST, 11))
	walk_button.add_theme_stylebox_override("pressed", _panel_style(RUST.darkened(.12), 11))
	walk_button.pressed.connect(_start_walk)
	column.add_child(walk_button)
	bottom.add_child(column)
	layer.add_child(bottom)

func _start_walk() -> void:
	walking = true
	walk_time = 0.0
	hiker.position = PATH_POINTS[0]
	walk_button.disabled = true
	walk_button.text = "In cammino…"
	status_label.text = "Il passo segue il terreno; acqua, vento e nuvole continuano a muoversi"

func _animate_environment() -> void:
	# Un movimento quasi impercettibile impedisce al quadro di sembrare una foto ferma.
	scene_camera.position.y = 9.4 + sin(total_time*.22)*.055
	scene_camera.look_at(Vector3(0,.55+sin(total_time*.18)*.025,-.15),Vector3.UP)
	for index in range(tree_crowns.size()):
		tree_crowns[index].rotation.z = sin(total_time*(1.0+index%3*.12)+index)*.012
	for index in range(clouds.size()):
		clouds[index].position.x += .0025*(index+1)
		if clouds[index].position.x > 8.5: clouds[index].position.x = -8.5
	for index in range(mist.size()):
		var node := mist[index]
		node.position.y = .55+index%3*.12+fmod(total_time*(.09+index*.006)+index*.08,.72)
		node.scale = Vector3.ONE*(.65+fmod(total_time*.12+index*.11,.55))

func _sample_route(progress: float) -> Array[Vector3]:
	var scaled := clampf(progress,0,1)*(PATH_POINTS.size()-1)
	var index := mini(int(scaled),PATH_POINTS.size()-2)
	var local := scaled-index
	var position: Vector3 = PATH_POINTS[index].lerp(PATH_POINTS[index+1],local)
	var direction: Vector3 = (PATH_POINTS[index+1]-PATH_POINTS[index]).normalized()
	return [position,direction]

func _add_tree(position: Vector3, scale_factor: float, birch: bool) -> void:
	var tree := Node3D.new(); tree.position=position; tree.scale=Vector3.ONE*scale_factor; add_child(tree)
	var trunk := CylinderMesh.new(); trunk.top_radius=.10; trunk.bottom_radius=.14; trunk.height=1.55; trunk.radial_segments=6
	_add_mesh(trunk,Vector3(0,.78,0),Vector3.ZERO,Vector3.ONE,_toon(Color("#ded7bb") if birch else Color("#604631")),tree)
	var crown := Node3D.new(); crown.position=Vector3(0,1.6,0); tree.add_child(crown); tree_crowns.append(crown)
	if birch:
		for offset in [Vector3(-.24,0,0),Vector3(.2,.16,.05),Vector3(0,.34,0)]:
			_add_mesh(_sphere(.46,7,4),offset,Vector3.ZERO,Vector3(1.15,.8,1),_toon(Color("#718151")),crown)
	else:
		for level in range(3):
			var leaves := CylinderMesh.new(); leaves.top_radius=0.0; leaves.bottom_radius=.62-level*.11; leaves.height=1.05; leaves.radial_segments=7
			_add_mesh(leaves,Vector3(0,level*.42,0),Vector3.ZERO,Vector3.ONE,_toon(Color("#3f6545").lightened(level*.05)),crown)

func _add_cloud(position: Vector3, scale_factor: float) -> void:
	var cloud := Node3D.new(); cloud.position=position; cloud.scale=Vector3.ONE*scale_factor; add_child(cloud); clouds.append(cloud)
	var material := _toon(Color("#f1ead9"),false)
	for offset in [Vector3(-.65,0,0),Vector3(0,.18,0),Vector3(.62,-.02,0),Vector3(.15,-.12,.15)]:
		_add_mesh(_sphere(.58,7,4),offset,Vector3.ZERO,Vector3(1.35,.72,.75),material,cloud)

func _add_rock(position: Vector3, rock_scale: Vector3, angle: float) -> void:
	_add_mesh(_sphere(.58,7,4),position,Vector3(.14,angle,.06),rock_scale,_toon(Color("#59605d").lightened(fmod(angle,.12))))

func _limb_pivot(position: Vector3, parent: Node3D) -> Node3D:
	var pivot := Node3D.new(); pivot.position=position; parent.add_child(pivot); return pivot

func _add_leg(pivot: Node3D, trouser: Material, boot: Material) -> void:
	var leg := CylinderMesh.new(); leg.top_radius=.15; leg.bottom_radius=.13; leg.height=.72; leg.radial_segments=7
	_add_mesh(leg,Vector3(0,-.36,0),Vector3.ZERO,Vector3.ONE,trouser,pivot)
	var shoe := BoxMesh.new(); shoe.size=Vector3(.3,.24,.46)
	_add_mesh(shoe,Vector3(0,-.77,-.08),Vector3.ZERO,Vector3.ONE,boot,pivot)

func _add_arm(pivot: Node3D, sleeve: Material, pole_material: Material, side: float) -> void:
	var arm := CylinderMesh.new(); arm.top_radius=.13; arm.bottom_radius=.11; arm.height=.72; arm.radial_segments=7
	_add_mesh(arm,Vector3(0,-.34,0),Vector3(0,0,side*.08),Vector3.ONE,sleeve,pivot)
	var pole := CylinderMesh.new(); pole.top_radius=.025; pole.bottom_radius=.025; pole.height=1.55; pole.radial_segments=6
	_add_mesh(pole,Vector3(side*.08,-.95,-.05),Vector3(0,0,side*.08),Vector3.ONE,pole_material,pivot)

func _sphere(radius: float, segments: int, rings: int) -> SphereMesh:
	var mesh := SphereMesh.new(); mesh.radius=radius; mesh.height=radius*2; mesh.radial_segments=segments; mesh.rings=rings; return mesh

func _add_mesh(mesh: Mesh, position: Vector3, rotation: Vector3, mesh_scale: Vector3, material: Material, parent: Node = self) -> MeshInstance3D:
	var instance := MeshInstance3D.new(); instance.mesh=mesh; instance.position=position; instance.rotation=rotation; instance.scale=mesh_scale; instance.material_override=material; parent.add_child(instance); return instance

func _toon(color: Color, outlined := true) -> StandardMaterial3D:
	var material := StandardMaterial3D.new()
	material.albedo_color=color
	material.diffuse_mode=BaseMaterial3D.DIFFUSE_TOON
	material.specular_mode=BaseMaterial3D.SPECULAR_DISABLED
	material.roughness=1.0
	if outlined: material.next_pass=outline_material
	return material

func _make_outline_material() -> ShaderMaterial:
	var shader := Shader.new()
	shader.code = """shader_type spatial;
render_mode unshaded, cull_front;
uniform vec4 outline_color : source_color = vec4(0.08,0.075,0.07,1.0);
uniform float outline_width = 0.025;
void vertex(){ VERTEX += NORMAL * outline_width; }
void fragment(){ ALBEDO = outline_color.rgb; ALPHA = outline_color.a; }"""
	var material := ShaderMaterial.new(); material.shader=shader; return material

func _water_material(vertical: bool) -> ShaderMaterial:
	var shader := Shader.new()
	shader.code = """shader_type spatial;
render_mode unshaded, cull_disabled;
uniform vec4 deep_color : source_color = vec4(0.12,0.43,0.55,1.0);
uniform vec4 light_color : source_color = vec4(0.72,0.91,0.88,1.0);
uniform float vertical = 0.0;
void vertex(){
	float axis = mix(VERTEX.x, VERTEX.y, vertical);
	VERTEX.z += sin(axis*7.0 + TIME*3.2)*0.025;
}
void fragment(){
	float pool_wave = sin((UV.x+UV.y*0.22)*26.0-TIME*2.4+sin(UV.y*11.0)*1.6)*0.5+0.5;
	float fall_streak = sin(UV.x*38.0+sin(UV.y*9.0-TIME*2.2)*2.2)*0.5+0.5;
	float pattern = mix(pool_wave,fall_streak,vertical);
	float foam = smoothstep(0.84,0.97,pattern);
	ALBEDO = mix(deep_color.rgb,light_color.rgb,foam*0.68);
	ROUGHNESS = 0.75;
}"""
	var material := ShaderMaterial.new(); material.shader=shader; material.set_shader_parameter("vertical",1.0 if vertical else 0.0); return material

func _mist_material() -> StandardMaterial3D:
	var material := StandardMaterial3D.new(); material.albedo_color=Color(1,.98,.9,.22); material.transparency=BaseMaterial3D.TRANSPARENCY_ALPHA; material.shading_mode=BaseMaterial3D.SHADING_MODE_UNSHADED; return material

func _ribbon(points: Array, width: float) -> ArrayMesh:
	var vertices := PackedVector3Array(); var normals := PackedVector3Array(); var indices := PackedInt32Array()
	for index in range(points.size()):
		var previous: Vector3 = points[maxi(0,index-1)]
		var following: Vector3 = points[mini(points.size()-1,index+1)]
		var direction := (following-previous).normalized()
		var side := Vector3(-direction.z,0,direction.x).normalized()*width*.5
		vertices.append(points[index]-side); vertices.append(points[index]+side)
		normals.append(Vector3.UP); normals.append(Vector3.UP)
	if points.size()>1:
		for index in range(points.size()-1):
			var base:=index*2; indices.append_array(PackedInt32Array([base,base+2,base+1,base+1,base+2,base+3]))
	var arrays:=[]; arrays.resize(Mesh.ARRAY_MAX); arrays[Mesh.ARRAY_VERTEX]=vertices; arrays[Mesh.ARRAY_NORMAL]=normals; arrays[Mesh.ARRAY_INDEX]=indices
	var mesh:=ArrayMesh.new(); mesh.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES,arrays); return mesh

func _panel_style(color: Color, radius: int) -> StyleBoxFlat:
	var style:=StyleBoxFlat.new(); style.bg_color=color; style.border_color=Color("#3b332c"); style.set_border_width_all(2); style.set_corner_radius_all(radius); style.content_margin_left=14; style.content_margin_right=14; style.content_margin_top=9; style.content_margin_bottom=9; return style

func _ui_label(text: String, size_px: int, color: Color, handwritten := false) -> Label:
	var result:=Label.new(); result.text=text; result.add_theme_font_size_override("font_size",size_px); result.add_theme_color_override("font_color",color)
	if handwritten:
		var font:=SystemFont.new(); font.font_names=PackedStringArray(["Caveat","Segoe Print","Comic Sans MS"]); font.font_weight=700; result.add_theme_font_override("font",font)
	return result
