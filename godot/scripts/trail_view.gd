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
		"weather": "SERENO · 8°", "kicker": "SOSTA",
		"title": "La Cascata di Lavvu", "event_title": "La borraccia vuota",
		"body": "L’acqua copre ogni rumore. Il sentiero prosegue accanto alla cascata.",
		"card": "res://assets/sprites/event/acqua.png",
		"choices": [["Riempi la borraccia", 1, 1, "ACQUA"], ["Fermati ad ascoltare", -1, 3, "CALMA"], ["Continua sul sentiero", 0, 0, "PASSA"]],
	},
	{
		"weather": "VENTO LEGGERO · 7°", "kicker": "SCOPERTA",
		"title": "La Sorgente Fredda", "event_title": "Acqua tra le rocce",
		"body": "La sorgente è così limpida che sembra immobile. L’aria sa di pietra bagnata.",
		"card": "res://assets/sprites/event/bussola.png",
		"choices": [["Bevi alla sorgente", 4, 1, "BEVI"], ["Bagna il viso", 1, 2, "SOSTA"], ["Passa oltre", 0, 0, "PASSA"]],
	},
	{
		"weather": "NUVOLOSO · 7°", "kicker": "TRACCIA",
		"title": "Le Betulle dell’Alce", "event_title": "Orme nel fango",
		"body": "Orme fresche attraversano il sentiero e scompaiono fra le betulle basse.",
		"card": "res://assets/sprites/event/impronte.png",
		"choices": [["Segui le orme", -3, 4, "RISCHIO"], ["Fai silenzio e aspetta", -1, 2, "ATTENDI"], ["Resta sul sentiero", 0, 0, "PASSA"]],
	},
	{
		"weather": "SOLE E RAFFICHE · 9°", "kicker": "RACCOLTA",
		"title": "La Costa dei Mirtilli", "event_title": "Una macchia blu",
		"body": "Il pendio è pieno di bacche. Il vento piega gli arbusti tutti insieme.",
		"card": "res://assets/sprites/event/cibo.png",
		"choices": [["Raccogli una manciata", 2, 3, "RACCOGLI"], ["Fermati per una foto", -1, 2, "RICORDO"], ["Continua a salire", 0, 0, "PASSA"]],
	},
	{
		"weather": "CALMA · 9°", "kicker": "INCONTRO",
		"title": "La Baia del Pescatore", "event_title": "La barca vuota",
		"body": "Una barca dondola accanto al pontile. Dal piccolo capanno non arriva rumore.",
		"card": "res://assets/sprites/event/persona.png",
		"choices": [["Controlla il capanno", -2, 3, "CERCA"], ["Riposa sul pontile", 3, 2, "RIPOSA"], ["Prosegui verso Vuolle", 0, 0, "PASSA"]],
	},
	{
		"weather": "LUCE DELLA SERA · 6°", "kicker": "ULTIMO SGUARDO",
		"title": "Il Belvedere di Vuolle", "event_title": "Finestre accese",
		"body": "Oltre il lago si accendono le finestre. Dietro il rifugio sale il fumo della sauna.",
		"card": "res://assets/sprites/event/rifugio.png",
		"choices": [["Raggiungi Rifugio Vuolle", -2, 5, "ARRIVA"]],
	},
]

const TEAL := Color("#0b2d32")
const INK := Color("#29251f")
const RUST := Color("#963d1d")
const OCHRE := Color("#e1ab43")
const MOSS := Color("#6f7d42")
const SOFT := Color("#665b50")

var poi := 0
var walking := false
var finished := false
var time := 0.0
var background: Texture2D
var header: PanelContainer
var header_title: Label
var header_progress: Label
var header_dots: Label
var stats_bar: PanelContainer
var stat_labels: Array[Label] = []
var drawer: PanelContainer
var drawer_content: VBoxContainer
var footer_bar: HBoxContainer
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
	drawer.add_theme_stylebox_override("panel", _paper_style())
	_refresh_header()
	_refresh_stats()
	if walking: _build_walking_drawer()
	else: _build_event_drawer()
	_move_interface(true)
	queue_redraw()

func set_walking(value: bool) -> void:
	walking = value
	if walking: _build_walking_drawer()
	else: _build_event_drawer()
	_move_interface()
	queue_redraw()

func show_finish() -> void:
	walking = false
	finished = true
	header_title.text = "Rifugio Vuolle"
	header_progress.text = "FINE TAPPA"
	header_dots.text = ""
	clear_children(drawer_content)
	drawer_content.add_child(_small_label("TAPPA COMPLETATA", 11, RUST))
	drawer_content.add_child(_title_label("Sei arrivato", 31))
	drawer_content.add_child(_body_label("Le finestre sono accese. Dietro il rifugio sale il fumo della sauna."))
	drawer_content.add_child(_small_label("14 km · %s · energia %d · morale %d" % [GameState.clock_text(), GameState.energy, GameState.morale], 13, SOFT))
	var spacer := Control.new()
	spacer.size_flags_vertical = Control.SIZE_EXPAND_FILL
	drawer_content.add_child(spacer)
	var restart := _choice_button("Ricomincia la tappa", 0, 0, "RIPARTI", false)
	restart.pressed.connect(func(): restart_requested.emit())
	drawer_content.add_child(restart)
	_refresh_stats()
	_move_interface()

func _create_header() -> void:
	header = PanelContainer.new()
	var style := _panel_style(Color(TEAL, .94), Color(1,1,1,.12), 0, 0)
	style.border_width_bottom = 1
	header.add_theme_stylebox_override("panel", style)
	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 18)
	margin.add_theme_constant_override("margin_right", 16)
	margin.add_theme_constant_override("margin_top", 10)
	margin.add_theme_constant_override("margin_bottom", 8)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 10)
	var stage := _small_label("TAPPA 1", 11, OCHRE)
	stage.custom_minimum_size.x = 54
	row.add_child(stage)
	var divider := VSeparator.new()
	divider.custom_minimum_size.x = 1
	row.add_child(divider)
	header_title = _small_label("", 17, Color("#fff6e5"))
	header_title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	header_title.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	row.add_child(header_title)
	var progress_box := VBoxContainer.new()
	progress_box.add_theme_constant_override("separation", -3)
	header_progress = _small_label("", 12, Color("#eee3cd"))
	header_progress.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	header_dots = _small_label("", 1, Color.TRANSPARENT)
	header_dots.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	progress_box.add_child(header_progress)
	progress_box.add_child(header_dots)
	row.add_child(progress_box)
	margin.add_child(row)
	header.add_child(margin)
	add_child(header)

func _create_stats() -> void:
	stats_bar = PanelContainer.new()
	stats_bar.add_theme_stylebox_override("panel", _panel_style(Color(TEAL, .97), Color(1,1,1,.18), 11, 1))
	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 8)
	margin.add_theme_constant_override("margin_right", 8)
	margin.add_theme_constant_override("margin_top", 8)
	margin.add_theme_constant_override("margin_bottom", 7)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 2)
	for index in range(4):
		var cell := VBoxContainer.new()
		cell.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		cell.add_theme_constant_override("separation", -3)
		var value := _small_label("", 20, OCHRE)
		value.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		var caption := _small_label("", 10, Color("#ddd4c5"))
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
	margin.add_theme_constant_override("margin_left", 18)
	margin.add_theme_constant_override("margin_right", 18)
	margin.add_theme_constant_override("margin_top", 11)
	margin.add_theme_constant_override("margin_bottom", 8)
	drawer_content = VBoxContainer.new()
	drawer_content.add_theme_constant_override("separation", 4)
	margin.add_child(drawer_content)
	drawer.add_child(margin)
	add_child(drawer)
	footer_bar = _shortcut_row()
	add_child(footer_bar)

func _refresh_header() -> void:
	header_title.text = str(POI[poi].title)
	header_progress.text = "%d / 6" % (poi + 1)
	header_dots.text = ""

func _refresh_stats() -> void:
	var values := [GameState.clock_text(), str(GameState.energy), str(GameState.morale), "%d €" % GameState.money]
	var captions := ["ORA", "ENERGIA", "MORALE", "SOLDI"]
	for index in range(4):
		stat_labels[index * 2].text = values[index]
		stat_labels[index * 2 + 1].text = captions[index]

func _build_event_drawer() -> void:
	clear_children(drawer_content)
	var top := HBoxContainer.new()
	var weather := _small_label(str(POI[poi].weather), 11, MOSS)
	weather.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	top.add_child(weather)
	top.add_child(_small_label("POI %d DI 6" % (poi + 1), 10, SOFT))
	drawer_content.add_child(top)
	var rule := HSeparator.new()
	rule.modulate = Color(RUST, .45)
	drawer_content.add_child(rule)
	var card_row := HBoxContainer.new()
	card_row.add_theme_constant_override("separation", 12)
	var copy := VBoxContainer.new()
	copy.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	copy.add_theme_constant_override("separation", 2)
	copy.add_child(_small_label(str(POI[poi].kicker), 10, RUST))
	copy.add_child(_title_label(str(POI[poi].event_title), 24))
	copy.add_child(_body_label(str(POI[poi].body)))
	card_row.add_child(copy)
	var illustration := TextureRect.new()
	illustration.texture = load(str(POI[poi].card))
	illustration.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	illustration.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	illustration.custom_minimum_size = Vector2(78, 82)
	card_row.add_child(illustration)
	drawer_content.add_child(card_row)
	for choice in POI[poi].choices:
		drawer_content.add_child(_choice_button(str(choice[0]), int(choice[1]), int(choice[2]), str(choice[3])))
	var spacer := Control.new()
	spacer.size_flags_vertical = Control.SIZE_EXPAND_FILL
	drawer_content.add_child(spacer)

func _build_walking_drawer() -> void:
	clear_children(drawer_content)
	var destination := "Rifugio Vuolle" if poi == 5 else str(POI[poi + 1].title)
	drawer_content.add_child(_small_label("IN CAMMINO · PROSSIMO PUNTO DI INTERESSE", 10, RUST))
	drawer_content.add_child(_title_label(destination, 28))
	drawer_content.add_child(_body_label("Il sentiero continua dentro il quadro. Il paesaggio resta visibile mentre passano tempo ed energia."))
	var line := HSeparator.new()
	line.modulate = Color(RUST, .40)
	drawer_content.add_child(line)
	var progress := _small_label("Tratto %d di 6 · arrivo tra pochi minuti" % (poi + 1), 12, SOFT)
	progress.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	drawer_content.add_child(progress)
	var spacer := Control.new()
	spacer.size_flags_vertical = Control.SIZE_EXPAND_FILL
	drawer_content.add_child(spacer)

func _choice_button(text_value: String, energy_delta: int, morale_delta: int, tag: String, emits_choice := true) -> Button:
	var result := Button.new()
	result.text = "%s  ·  %s                                      >" % [text_value, tag]
	result.alignment = HORIZONTAL_ALIGNMENT_LEFT
	result.custom_minimum_size.y = 42
	result.add_theme_font_size_override("font_size", 14)
	result.add_theme_color_override("font_color", INK)
	result.add_theme_color_override("font_hover_color", RUST)
	result.add_theme_stylebox_override("normal", _panel_style(Color("#f8ecd3d9"), Color("#c5b69a"), 7, 1))
	result.add_theme_stylebox_override("hover", _panel_style(Color("#fff7e5"), RUST, 7, 1))
	result.add_theme_stylebox_override("pressed", _panel_style(Color("#e6d4b3"), RUST, 7, 1))
	if emits_choice: result.pressed.connect(func(): choice_selected.emit(energy_delta, morale_delta))
	return result

func _shortcut_row() -> HBoxContainer:
	var row := HBoxContainer.new()
	row.alignment = BoxContainer.ALIGNMENT_CENTER
	row.add_theme_constant_override("separation", 34)
	var notebook := Button.new()
	notebook.text = "TACCUINO"
	notebook.flat = true
	notebook.add_theme_font_size_override("font_size", 12)
	notebook.add_theme_color_override("font_color", INK)
	row.add_child(notebook)
	var divider := VSeparator.new()
	divider.custom_minimum_size.y = 28
	row.add_child(divider)
	var pack := Button.new()
	pack.text = "ZAINO"
	pack.flat = true
	pack.add_theme_font_size_override("font_size", 12)
	pack.add_theme_color_override("font_color", INK)
	pack.pressed.connect(func(): pack_requested.emit())
	row.add_child(pack)
	return row

func _layout_interface() -> void:
	if size.x <= 0 or not header: return
	header.position = Vector2.ZERO
	header.size = Vector2(size.x, 72)
	drawer.size.x = size.x - 12
	drawer.position.x = 6
	stats_bar.size.x = size.x - 18
	stats_bar.position.x = 9
	footer_bar.size = Vector2(170, 34)
	footer_bar.position = Vector2((size.x - footer_bar.size.x) * .5, size.y - 39)
	_move_interface(true)

func _move_interface(immediate := false) -> void:
	if not drawer or size.y <= 0: return
	var drawer_height := 450.0
	if walking: drawer_height = 236.0
	if finished: drawer_height = 286.0
	drawer_height = minf(drawer_height, size.y * .56)
	drawer.size.y = drawer_height
	var drawer_y := size.y - drawer_height
	var stats_y := drawer_y - 67.0
	if interface_tween and interface_tween.is_valid(): interface_tween.kill()
	if immediate:
		drawer.position.y = drawer_y
		stats_bar.position.y = stats_y
	else:
		interface_tween = create_tween().set_parallel(true).set_trans(Tween.TRANS_QUINT).set_ease(Tween.EASE_OUT)
		interface_tween.tween_property(drawer, "position:y", drawer_y, .52)
		interface_tween.tween_property(stats_bar, "position:y", stats_y, .52)

func _process(delta: float) -> void:
	time += delta
	queue_redraw()

func _draw() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), TEAL)
	if background:
		var scene_bottom := maxf(220.0, stats_bar.position.y + 12.0)
		var scene_rect := Rect2(Vector2(0, 55), Vector2(size.x, scene_bottom - 55.0))
		_draw_texture_cover(background, scene_rect)
	_draw_atmosphere()
	_draw_progress_dots()

func _draw_progress_dots() -> void:
	var start_x := size.x - 65.0
	for index in range(6):
		var fill := OCHRE if index <= poi else Color("#789094")
		draw_circle(Vector2(start_x + index * 9.0, 51.0), 2.5, fill)

func _draw_texture_cover(texture: Texture2D, target: Rect2) -> void:
	var texture_size := texture.get_size()
	if texture_size.x <= 0 or texture_size.y <= 0: return
	var factor := maxf(target.size.x / texture_size.x, target.size.y / texture_size.y)
	var source_size := target.size / factor
	var source_position := (texture_size - source_size) * .5
	draw_texture_rect_region(texture, target, Rect2(source_position, source_size))

func _draw_atmosphere() -> void:
	if not stats_bar: return
	var scene_bottom := stats_bar.position.y
	for index in range(3):
		var x := fmod(time * (6.0 + index * 1.4) + index * 149.0, size.x + 180.0) - 90.0
		draw_circle(Vector2(x, 142.0 + index * 69.0), 48.0 + index * 10.0, Color(0.04,0.12,0.14,.035))
	if poi in [0, 1, 4, 5]:
		for index in range(6):
			var glint_x := fmod(time * (18.0 + index) + index * 67.0, size.x * .9)
			var glint_y := minf(scene_bottom - 32.0, 224.0 + (index % 3) * 17.0)
			draw_line(Vector2(glint_x, glint_y), Vector2(glint_x + 12, glint_y), Color(1,.95,.72,.22), 1.2, true)
	if poi in [2, 3]:
		for index in range(8):
			var leaf_x := fmod(time * (11.0 + index % 3) + index * 47.0, size.x + 30.0) - 15.0
			var leaf_y := 110.0 + fmod(time * (4.0 + index % 2) + index * 35.0, maxf(60.0, scene_bottom - 140.0))
			draw_circle(Vector2(leaf_x, leaf_y), 1.5, Color("#d7a63b"))

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

func _paper_style() -> StyleBoxTexture:
	var wear := clampi(1 + poi * 4 / 6, 1, 4)
	var style := StyleBoxTexture.new()
	style.texture = load("res://assets/paper/paper-stage-1-%d.jpg" % wear)
	style.set_texture_margin(SIDE_LEFT, 42)
	style.set_texture_margin(SIDE_TOP, 42)
	style.set_texture_margin(SIDE_RIGHT, 42)
	style.set_texture_margin(SIDE_BOTTOM, 42)
	style.set_content_margin(SIDE_LEFT, 8)
	style.set_content_margin(SIDE_TOP, 8)
	style.set_content_margin(SIDE_RIGHT, 8)
	style.set_content_margin(SIDE_BOTTOM, 8)
	return style

func _small_label(text_value: String, size_px: int, color: Color) -> Label:
	var result := Label.new()
	result.text = text_value
	result.add_theme_font_size_override("font_size", size_px)
	result.add_theme_color_override("font_color", color)
	return result

func _title_label(text_value: String, size_px: int) -> Label:
	var result := _small_label(text_value, size_px, INK)
	var serif := SystemFont.new()
	serif.font_names = PackedStringArray(["Georgia", "Palatino Linotype", "Times New Roman"])
	serif.font_weight = 600
	result.add_theme_font_override("font", serif)
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
