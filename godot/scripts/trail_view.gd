class_name TrailView
extends Control

signal choice_selected(energy_delta: int, morale_delta: int)
signal pack_requested
signal restart_requested

const BACKGROUNDS := [
	"res://assets/godot/poi-t1-01-cascata-isometric.png",
	"res://assets/godot/poi-t1-02-sorgente-isometric.png",
	"res://assets/godot/poi-t1-03-betulle-isometric.png",
	"res://assets/godot/poi-t1-04-mirtilli-isometric.png",
	"res://assets/godot/poi-t1-05-baia-isometric.png",
	"res://assets/godot/poi-t1-06-belvedere-isometric.png",
]

const POI := [
	{
		"weather": "SERENO · 8°", "kicker": "PUNTO DI INTERESSE",
		"title": "La Cascata di Lavvu",
		"body": "L’acqua copre ogni rumore. Il sentiero prosegue accanto alla cascata.",
		"choices": [["Riempi la borraccia", 1, 1], ["Fermati ad ascoltare", -1, 3], ["Continua sul sentiero", 0, 0]],
	},
	{
		"weather": "VENTO LEGGERO · 7°", "kicker": "SOSTA",
		"title": "La Sorgente Fredda",
		"body": "L’acqua nasce tra due rocce. È così limpida che sembra immobile.",
		"choices": [["Bevi alla sorgente", 4, 1], ["Bagna il viso", 1, 2], ["Passa oltre", 0, 0]],
	},
	{
		"weather": "NUVOLOSO · 7°", "kicker": "TRACCIA",
		"title": "Le Betulle dell’Alce",
		"body": "Orme fresche attraversano il fango e scompaiono fra le betulle basse.",
		"choices": [["Segui le orme per un tratto", -3, 4], ["Fai silenzio e aspetta", -1, 2], ["Resta sul sentiero", 0, 0]],
	},
	{
		"weather": "SOLE E RAFFICHE · 9°", "kicker": "RACCOLTA",
		"title": "La Costa dei Mirtilli",
		"body": "Il pendio è blu di bacche. Il vento piega gli arbusti tutti insieme.",
		"choices": [["Raccogli una manciata", 2, 3], ["Fermati per una foto", -1, 2], ["Continua a salire", 0, 0]],
	},
	{
		"weather": "CALMA · 9°", "kicker": "INCONTRO",
		"title": "La Baia del Pescatore",
		"body": "Una barca vuota dondola accanto al pontile. Dal capanno non arriva rumore.",
		"choices": [["Controlla che sia tutto a posto", -2, 3], ["Riposa sul pontile", 3, 2], ["Prosegui verso Vuolle", 0, 0]],
	},
	{
		"weather": "LUCE DELLA SERA · 6°", "kicker": "ULTIMO SGUARDO",
		"title": "Il Belvedere di Vuolle",
		"body": "Oltre il lago si accendono le finestre del rifugio. La tappa è quasi finita.",
		"choices": [["Raggiungi Rifugio Vuolle", -2, 5]],
	},
]

const TEAL := Color("#0d3035")
const PAPER := Color("#f1e5ca")
const INK := Color("#2d2924")
const RUST := Color("#943d1d")
const OCHRE := Color("#dda63b")
const MOSS := Color("#788346")
const SOFT := Color("#6d6156")

var poi := 0
var walking := false
var finished := false
var time := 0.0
var background: Texture2D
var header: PanelContainer
var header_title: Label
var header_progress: Label
var stats_bar: PanelContainer
var stat_labels: Array[Label] = []
var drawer: PanelContainer
var drawer_content: VBoxContainer
var interface_tween: Tween

func _ready() -> void:
	clip_contents = true
	mouse_filter = Control.MOUSE_FILTER_PASS
	_create_header()
	_create_stats()
	_create_drawer()
	resized.connect(_layout_interface)
	set_process(true)
	call_deferred("_layout_interface")

func configure(next_poi: int, is_walking: bool) -> void:
	poi = clampi(next_poi, 0, BACKGROUNDS.size() - 1)
	walking = is_walking
	finished = false
	background = load(BACKGROUNDS[poi])
	_refresh_header()
	_refresh_stats()
	_build_drawer()
	_move_interface(not walking, true)
	queue_redraw()

func set_walking(value: bool) -> void:
	walking = value
	if walking:
		_build_walking_drawer()
	_move_interface(not walking)
	queue_redraw()

func show_finish() -> void:
	walking = false
	finished = true
	header_title.text = "Rifugio Vuolle"
	header_progress.text = "FINE TAPPA"
	clear_children(drawer_content)
	drawer_content.add_child(_small_label("TAPPA COMPLETATA", 12, RUST))
	drawer_content.add_child(_title_label("Sei arrivato", 30))
	drawer_content.add_child(_body_label("Le finestre sono accese. Dietro il rifugio sale il fumo della sauna."))
	drawer_content.add_child(_small_label("14 km  ·  %s  ·  energia %d  ·  morale %d" % [GameState.clock_text(), GameState.energy, GameState.morale], 14, SOFT))
	var restart := _choice_button("Ricomincia la prova della tappa", 0, 0, false)
	restart.pressed.connect(func(): restart_requested.emit())
	drawer_content.add_child(restart)
	drawer_content.add_child(_shortcut_row())
	_refresh_stats()
	_move_interface(true)

func _create_header() -> void:
	header = PanelContainer.new()
	header.add_theme_stylebox_override("panel", _panel_style(Color(TEAL, .88), Color(1,1,1,.11), 13, 1))
	var margin := MarginContainer.new()
	for side in ["margin_left", "margin_right"]: margin.add_theme_constant_override(side, 15)
	for side in ["margin_top", "margin_bottom"]: margin.add_theme_constant_override(side, 9)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 10)
	var stage := _small_label("TAPPA 1", 12, OCHRE)
	stage.custom_minimum_size.x = 60
	row.add_child(stage)
	row.add_child(VSeparator.new())
	header_title = _small_label("", 18, Color("#fff7e8"))
	header_title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	header_title.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	row.add_child(header_title)
	header_progress = _small_label("", 12, Color("#e5dcc9"))
	header_progress.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	row.add_child(header_progress)
	margin.add_child(row)
	header.add_child(margin)
	add_child(header)

func _create_stats() -> void:
	stats_bar = PanelContainer.new()
	stats_bar.add_theme_stylebox_override("panel", _panel_style(Color(TEAL, .94), Color(1,1,1,.13), 11, 1))
	var margin := MarginContainer.new()
	for side in ["margin_left", "margin_right"]: margin.add_theme_constant_override(side, 8)
	for side in ["margin_top", "margin_bottom"]: margin.add_theme_constant_override(side, 6)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 3)
	for icon in ["◷", "ϟ", "♥", "€"]:
		var cell := VBoxContainer.new()
		cell.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		cell.add_theme_constant_override("separation", -2)
		var value := _small_label(icon, 18, OCHRE)
		value.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		var caption := _small_label("", 10, Color("#d7d0c2"))
		caption.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		cell.add_child(value)
		cell.add_child(caption)
		row.add_child(cell)
		stat_labels.append(value)
		stat_labels.append(caption)
	margin.add_child(row)
	stats_bar.add_child(margin)
	add_child(stats_bar)

func _create_drawer() -> void:
	drawer = PanelContainer.new()
	drawer.add_theme_stylebox_override("panel", _paper_style())
	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 20)
	margin.add_theme_constant_override("margin_right", 20)
	margin.add_theme_constant_override("margin_top", 13)
	margin.add_theme_constant_override("margin_bottom", 12)
	drawer_content = VBoxContainer.new()
	drawer_content.add_theme_constant_override("separation", 5)
	margin.add_child(drawer_content)
	drawer.add_child(margin)
	add_child(drawer)

func _refresh_header() -> void:
	header_title.text = str(POI[poi].title)
	header_progress.text = "%d / 6" % (poi + 1)

func _refresh_stats() -> void:
	var values := [GameState.clock_text(), str(GameState.energy), str(GameState.morale), str(GameState.money)]
	var captions := ["ORA", "ENERGIA", "MORALE", "SOLDI"]
	for index in range(4):
		stat_labels[index * 2].text = values[index]
		stat_labels[index * 2 + 1].text = captions[index]

func _build_drawer() -> void:
	clear_children(drawer_content)
	var top := HBoxContainer.new()
	var weather := _small_label(str(POI[poi].weather), 12, MOSS)
	weather.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	top.add_child(weather)
	top.add_child(_small_label("POI %d DI 6" % (poi + 1), 11, SOFT))
	drawer_content.add_child(top)
	drawer_content.add_child(_small_label(str(POI[poi].kicker), 11, RUST))
	drawer_content.add_child(_title_label(str(POI[poi].title), 25))
	drawer_content.add_child(_body_label(str(POI[poi].body)))
	for choice in POI[poi].choices:
		drawer_content.add_child(_choice_button(str(choice[0]), int(choice[1]), int(choice[2])))
	drawer_content.add_child(_shortcut_row())

func _build_walking_drawer() -> void:
	clear_children(drawer_content)
	drawer_content.add_child(_small_label("IN CAMMINO", 11, RUST))
	var destination := "Rifugio Vuolle" if poi == 5 else str(POI[poi + 1].title)
	drawer_content.add_child(_title_label("Verso %s" % destination, 24))
	drawer_content.add_child(_body_label("Il quadro si apre. Restano il vento, l’acqua e il rumore dei passi."))

func _choice_button(text_value: String, energy_delta: int, morale_delta: int, emits_choice := true) -> Button:
	var result := Button.new()
	result.text = "%s    >" % text_value
	result.alignment = HORIZONTAL_ALIGNMENT_LEFT
	result.custom_minimum_size.y = 39
	result.add_theme_font_size_override("font_size", 15)
	result.add_theme_color_override("font_color", INK)
	result.add_theme_color_override("font_hover_color", RUST)
	result.add_theme_stylebox_override("normal", _panel_style(Color("#f7edd8"), Color("#c6b99f"), 8, 1))
	result.add_theme_stylebox_override("hover", _panel_style(Color("#fff7e7"), RUST, 8, 1))
	result.add_theme_stylebox_override("pressed", _panel_style(Color("#ead9bb"), RUST, 8, 1))
	if emits_choice: result.pressed.connect(func(): choice_selected.emit(energy_delta, morale_delta))
	return result

func _shortcut_row() -> HBoxContainer:
	var row := HBoxContainer.new()
	row.alignment = BoxContainer.ALIGNMENT_CENTER
	row.add_theme_constant_override("separation", 12)
	var notebook := Button.new()
	notebook.text = "Taccuino"
	notebook.flat = true
	notebook.add_theme_font_size_override("font_size", 13)
	notebook.add_theme_color_override("font_color", SOFT)
	row.add_child(notebook)
	var pack := Button.new()
	pack.text = "Zaino"
	pack.flat = true
	pack.add_theme_font_size_override("font_size", 13)
	pack.add_theme_color_override("font_color", SOFT)
	pack.pressed.connect(func(): pack_requested.emit())
	row.add_child(pack)
	return row

func _layout_interface() -> void:
	if size.x <= 0 or not header: return
	header.position = Vector2(10, 10)
	header.size = Vector2(size.x - 20, 58)
	drawer.size.x = size.x - 14
	drawer.position.x = 7
	stats_bar.size = Vector2(size.x - 18, 62)
	stats_bar.position.x = 9
	_move_interface(not walking, true)

func _move_interface(expanded: bool, immediate := false) -> void:
	if not drawer or size.y <= 0: return
	var required_height := clampf(drawer.get_combined_minimum_size().y + 8.0, 250.0, size.y * .54)
	drawer.size.y = required_height
	var drawer_y := size.y - (required_height + 8.0) if expanded else size.y - 190.0
	var stats_y := drawer_y - 66.0
	if interface_tween and interface_tween.is_valid(): interface_tween.kill()
	if immediate:
		drawer.position.y = drawer_y
		stats_bar.position.y = stats_y
	else:
		interface_tween = create_tween().set_parallel(true).set_trans(Tween.TRANS_QUINT).set_ease(Tween.EASE_OUT)
		interface_tween.tween_property(drawer, "position:y", drawer_y, .58)
		interface_tween.tween_property(stats_bar, "position:y", stats_y, .58)

func _process(delta: float) -> void:
	time += delta
	queue_redraw()

func _draw() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), TEAL)
	if background:
		var scene_size := size.x + 28.0
		var drift := Vector2(sin(time * .12) * 2.2, cos(time * .10) * 1.3)
		draw_texture_rect(background, Rect2(Vector2(-14, 48) + drift, Vector2(scene_size, scene_size)), false)
	_draw_atmosphere()

func _draw_atmosphere() -> void:
	var scene_bottom := minf(size.y * .70, 48.0 + size.x + 24.0)
	for index in range(3):
		var x := fmod(time * (7.0 + index * 1.7) + index * 147.0, size.x + 170.0) - 85.0
		draw_circle(Vector2(x, 145.0 + index * 73.0), 52.0 + index * 9.0, Color(0.05,0.13,0.15,.035))
	if poi in [0, 1, 2, 4, 5]:
		for index in range(6):
			var glint_x := fmod(time * (19.0 + index) + index * 71.0, size.x * .82)
			var glint_y := 234.0 + (index % 3) * 19.0
			draw_line(Vector2(glint_x, glint_y), Vector2(glint_x + 13, glint_y), Color(1,.95,.72,.24), 1.3, true)
	if poi in [1, 2]:
		for index in range(5):
			var pulse := fmod(time * 18.0 + index * 17.0, 48.0)
			draw_arc(Vector2(205 + index * 21, 288 + index % 2 * 14), 8 + pulse * .35, .2, 2.8, 22, Color(.78,.94,.94,.23), 1.2, true)
	if poi in [2, 3]:
		for index in range(9):
			var leaf_x := fmod(time * (12.0 + index % 3) + index * 49.0, size.x + 30.0) - 15.0
			var leaf_y := 120.0 + fmod(time * (5.0 + index % 2) + index * 37.0, maxf(80.0, scene_bottom - 135.0))
			draw_circle(Vector2(leaf_x, leaf_y), 1.6, Color("#d5a33a"))
	if poi == 4:
		for index in range(2):
			var bird_x := fmod(time * (15.0 + index * 3.0) + index * 210.0, size.x + 50.0) - 25.0
			var bird_y := 115.0 + index * 18.0
			draw_arc(Vector2(bird_x, bird_y), 5.0, PI, TAU, 10, Color(1,1,1,.48), 1.2, true)

func _panel_style(fill: Color, border: Color, radius: int, width: int) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = fill
	style.border_color = border
	style.set_border_width_all(width)
	style.set_corner_radius_all(radius)
	style.content_margin_left = 10
	style.content_margin_right = 10
	style.content_margin_top = 6
	style.content_margin_bottom = 6
	return style

func _paper_style() -> StyleBoxFlat:
	var style := _panel_style(PAPER, Color("#aa9576"), 15, 1)
	style.shadow_color = Color(0,0,0,.30)
	style.shadow_size = 9
	style.shadow_offset = Vector2(0,-3)
	return style

func _small_label(text_value: String, size_px: int, color: Color) -> Label:
	var result := Label.new()
	result.text = text_value
	result.add_theme_font_size_override("font_size", size_px)
	result.add_theme_color_override("font_color", color)
	return result

func _title_label(text_value: String, size_px: int) -> Label:
	var result := _small_label(text_value, size_px, INK)
	result.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	return result

func _body_label(text_value: String) -> Label:
	var result := _small_label(text_value, 14, SOFT)
	result.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	result.max_lines_visible = 2
	return result

func clear_children(parent: Node) -> void:
	for child in parent.get_children():
		parent.remove_child(child)
		child.queue_free()
