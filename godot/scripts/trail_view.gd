class_name TrailView
extends Control

signal choice_selected(choice: Dictionary)
signal pack_requested
signal restart_requested

const POI := [
	{
		"background": "res://assets/godot/poi-t1-01-cascata-cutout.png",
		"weather": "SERENO · 8°", "kicker": "SOSTA",
		"title": "La Cascata di Lavvu", "event_title": "La borraccia vuota",
		"body": "L’acqua copre ogni rumore. Il sentiero prosegue accanto alla cascata.",
		"card": "res://assets/sprites/event/acqua.png",
		"walking_title": "Verso la Sorgente Fredda",
		"walking_body": "Il fragore della cascata si attenua. Il sentiero risale il torrente fra rocce umide e ginepri bassi.",
		"walking_note": "Il rumore dell’acqua resta alla tua destra.",
		"choices": [
			{"title":"Riempi la borraccia", "energy":1, "morale":1, "minutes":10, "tag":"ACQUA", "detail":"Energia +1 · Morale +1 · 10 min"},
			{"title":"Fermati ad ascoltare", "energy":-1, "morale":3, "minutes":15, "tag":"CALMA", "detail":"Energia −1 · Morale +3 · 15 min"},
			{"title":"Continua sul sentiero", "energy":0, "morale":0, "minutes":0, "tag":"PASSA", "detail":"Nessun costo immediato"},
		],
	},
	{
		"background": "res://assets/godot/poi-t1-02-sorgente-cutout-v2.png",
		"weather": "VENTO LEGGERO · 7°", "kicker": "SCOPERTA",
		"title": "La Sorgente Fredda", "event_title": "Acqua tra le rocce",
		"body": "La sorgente è così limpida che sembra immobile. L’aria sa di pietra bagnata.",
		"card": "res://assets/sprites/event/bussola.png",
		"walking_title": "Verso le Betulle dell’Alce",
		"walking_body": "La valle si stringe e il terreno diventa scuro. Le prime betulle nane compaiono oltre il dosso.",
		"walking_note": "Il vento porta odore di terra bagnata.",
		"choices": [
			{"title":"Bevi alla sorgente", "energy":4, "morale":1, "minutes":5, "tag":"BEVI", "detail":"Energia +4 · Morale +1 · 5 min"},
			{"title":"Bagna il viso", "energy":1, "morale":2, "minutes":10, "tag":"SOSTA", "detail":"Energia +1 · Morale +2 · 10 min"},
			{"title":"Passa oltre", "energy":0, "morale":0, "minutes":0, "tag":"PASSA", "detail":"Nessun costo immediato"},
		],
	},
	{
		"background": "res://assets/godot/poi-t1-03-betulle-cutout.png",
		"weather": "NUVOLOSO · 7°", "kicker": "TRACCIA",
		"title": "Le Betulle dell’Alce", "event_title": "Orme nel fango",
		"body": "Orme fresche attraversano il sentiero e scompaiono fra le betulle basse.",
		"card": "res://assets/sprites/event/impronte.png",
		"walking_title": "Verso la Costa dei Mirtilli",
		"walking_body": "Le betulle si diradano. Il sentiero sale su un pendio aperto, macchiato di blu e rosso.",
		"walking_note": "Dietro di te un ramo si spezza, poi torna il silenzio.",
		"choices": [
			{"title":"Segui le orme", "energy":-3, "morale":4, "minutes":20, "tag":"RISCHIO", "detail":"Rischio medio · Energia −3 · Morale +4 · 20 min"},
			{"title":"Fai silenzio e aspetta", "energy":-1, "morale":2, "minutes":15, "tag":"ATTENDI", "detail":"Energia −1 · Morale +2 · 15 min"},
			{"title":"Resta sul sentiero", "energy":0, "morale":0, "minutes":0, "tag":"PASSA", "detail":"Scelta prudente · nessun costo"},
		],
	},
	{
		"background": "res://assets/godot/poi-t1-04-mirtilli-cutout.png",
		"weather": "SOLE E RAFFICHE · 9°", "kicker": "RACCOLTA",
		"title": "La Costa dei Mirtilli", "event_title": "Una macchia blu",
		"body": "Il pendio è pieno di bacche. Il vento piega gli arbusti tutti insieme.",
		"card": "res://assets/sprites/event/cibo.png",
		"walking_title": "Verso la Baia del Pescatore",
		"walking_body": "Superato il crinale, il lago appare fra i massi. Una traccia chiara scende verso un piccolo pontile.",
		"walking_note": "L’acqua è immobile; qualcosa urta piano contro il legno.",
		"choices": [
			{"title":"Raccogli una manciata", "energy":2, "morale":3, "minutes":15, "tag":"RACCOGLI", "detail":"Energia +2 · Morale +3 · 15 min"},
			{"title":"Fermati per una foto", "energy":-1, "morale":2, "minutes":10, "tag":"RICORDO", "detail":"Energia −1 · Morale +2 · 10 min"},
			{"title":"Continua a salire", "energy":0, "morale":0, "minutes":0, "tag":"PASSA", "detail":"Nessun costo immediato"},
		],
	},
	{
		"background": "res://assets/godot/poi-t1-05-baia-cutout.png",
		"weather": "CALMA · 9°", "kicker": "INCONTRO",
		"title": "La Baia del Pescatore", "event_title": "La barca vuota",
		"body": "Una barca dondola accanto al pontile. Dal piccolo capanno non arriva rumore.",
		"card": "res://assets/sprites/event/persona.png",
		"walking_title": "Verso il Belvedere di Vuolle",
		"walking_body": "La baia rimane sotto di te. Il sentiero taglia il fianco della montagna verso la luce della sera.",
		"walking_note": "Sul lago compare il riflesso delle prime finestre accese.",
		"choices": [
			{"title":"Controlla il capanno", "energy":-2, "morale":3, "minutes":15, "tag":"CERCA", "detail":"Rischio medio · Energia −2 · Morale +3 · 15 min"},
			{"title":"Riposa sul pontile", "energy":3, "morale":2, "minutes":20, "tag":"RIPOSA", "detail":"Energia +3 · Morale +2 · 20 min"},
			{"title":"Prosegui verso Vuolle", "energy":0, "morale":0, "minutes":0, "tag":"PASSA", "detail":"Nessun costo immediato"},
		],
	},
	{
		"background": "res://assets/godot/poi-t1-06-belvedere-cutout.png",
		"weather": "LUCE DELLA SERA · 6°", "kicker": "ULTIMO SGUARDO",
		"title": "Il Belvedere di Vuolle", "event_title": "Finestre accese",
		"body": "Oltre il lago si accendono le finestre. Dietro il rifugio sale il fumo della sauna.",
		"card": "res://assets/sprites/event/rifugio.png",
		"walking_title": "Discesa a Rifugio Vuolle",
		"walking_body": "L’ultimo tratto scende verso il lago. Il cartello di Vuolle emerge fra i cespugli e il fumo della sauna sale diritto.",
		"walking_note": "Mancano pochi minuti: al rifugio c’è ancora luce.",
		"choices": [
			{"title":"Raggiungi Rifugio Vuolle", "energy":-2, "morale":5, "minutes":10, "tag":"ARRIVA", "detail":"Energia −2 · Morale +5 · 10 min"},
		],
	},
]

const FINISH_BACKGROUND := "res://assets/godot/poi-t1-vuolle-refuge-isometric-v1.png"

const TEAL := Color("#0b2d32")
const INK := Color("#29251f")
const RUST := Color("#963d1d")
const OCHRE := Color("#e1ab43")
const MOSS := Color("#6f7d42")
const SOFT := Color("#665b50")
const SERIF := preload("res://assets/fonts/Spectral-Regular.ttf")
const SERIF_SEMIBOLD := preload("res://assets/fonts/Spectral-SemiBold.ttf")
const HAND := preload("res://assets/fonts/Caveat-Variable.ttf")
const StatIconControl := preload("res://godot/scripts/stat_icon.gd")
const HEADER_FRAME := "res://assets/ui/header-frame-v2.png"

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
var stat_values: Array[Label] = []
var stat_bars: Array[ProgressBar] = []
var stat_icons: Array[Control] = []
var drawer: PanelContainer
var drawer_content: VBoxContainer
var footer_bar: HBoxContainer
var interface_tween: Tween
var sauna_used := false
var finish_resolved := false

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
	poi = clampi(next_poi, 0, POI.size() - 1)
	walking = is_walking
	finished = false
	finish_resolved = false
	background = load(str(POI[poi].background))
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
	finish_resolved = false
	background = load(FINISH_BACKGROUND)
	header_title.text = "Rifugio Vuolle"
	header_progress.text = "FINE TAPPA"
	header_dots.text = ""
	drawer.add_theme_stylebox_override("panel", _paper_style())
	_build_finish_drawer()
	_refresh_stats()
	_move_interface()
	queue_redraw()

func _build_finish_drawer() -> void:
	clear_children(drawer_content)
	var top := HBoxContainer.new()
	var arrival := _small_label("ARRIVO · %s" % GameState.clock_text(), 11, MOSS)
	arrival.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	top.add_child(arrival)
	top.add_child(_small_label("14 KM COMPLETATI", 10, SOFT))
	drawer_content.add_child(top)
	drawer_content.add_child(_title_label("Dove dormi?", 30))
	drawer_content.add_child(_body_label("A Vuolle c’è ancora un letto libero. La sauna sul lago è accesa e il custode sta chiudendo il registro."))
	if not sauna_used:
		var sauna := {"title":"Sauna e tuffo nel torrente", "energy":12, "morale":15, "money":0, "tag":"SAUNA", "detail":"Energia +12 · Morale +15 · asciughi tutto", "icon":"res://assets/sprites/event/rifugio.png"}
		var sauna_button := _choice_button(sauna, false)
		sauna_button.pressed.connect(_use_sauna)
		drawer_content.add_child(sauna_button)
	else:
		drawer_content.add_child(_small_label("✓ Sauna fatta · vestiti asciutti e testa leggera", 11, MOSS))
	var sleep_label := _small_label("PER LA NOTTE", 10, RUST)
	drawer_content.add_child(sleep_label)
	for option in [
		{"title":"Letto nel rifugio", "energy":35, "morale":5, "money":-30, "tag":"30 €", "detail":"Recupero pieno · scarpe asciutte · batteria carica", "icon":"res://assets/sprites/gear/quiltPiuma.png"},
		{"title":"Pavimento del locale comune", "energy":20, "morale":2, "money":-15, "tag":"15 €", "detail":"Recupero ridotto · al caldo", "icon":"res://assets/sprites/gear/matSchiuma.png"},
		{"title":"Tenda vicino al lago", "energy":10, "morale":0, "money":0, "tag":"GRATIS", "detail":"Recupero minimo · notte all’aperto", "icon":"res://assets/sprites/gear/tenda.png"},
	]:
		var sleep_button := _choice_button(option, false)
		sleep_button.pressed.connect(_resolve_finish.bind(option))
		drawer_content.add_child(sleep_button)
	var footer_clearance := Control.new()
	footer_clearance.custom_minimum_size.y = 44
	drawer_content.add_child(footer_clearance)

func _use_sauna() -> void:
	if sauna_used: return
	sauna_used = true
	GameState.energy = clampi(GameState.energy + 12, 0, 100)
	GameState.morale = clampi(GameState.morale + 15, 0, 100)
	GameState.hour_minutes += 35
	GameState.save_game()
	_build_finish_drawer()
	_refresh_stats()
	queue_redraw()

func _resolve_finish(option: Dictionary) -> void:
	if finish_resolved: return
	finish_resolved = true
	GameState.energy = clampi(GameState.energy + int(option.get("energy", 0)), 0, 100)
	GameState.morale = clampi(GameState.morale + int(option.get("morale", 0)), 0, 100)
	GameState.money = maxi(0, GameState.money + int(option.get("money", 0)))
	GameState.save_game()
	clear_children(drawer_content)
	drawer_content.add_child(_small_label("TAPPA 1 COMPLETATA", 11, MOSS))
	drawer_content.add_child(_title_label("Notte a Vuolle", 31))
	drawer_content.add_child(_body_label("Hai scelto: %s. Domattina il cammino ripartirà dal lago." % str(option.title)))
	drawer_content.add_child(_small_label("Energia %d · Morale %d · %d €" % [GameState.energy, GameState.morale, GameState.money], 13, SOFT))
	var restart := _choice_button({"title":"Ricomincia la tappa", "energy":0, "morale":0, "tag":"RIPARTI", "detail":"Torna alla Cascata di Lavvu"}, false)
	restart.pressed.connect(func(): restart_requested.emit())
	drawer_content.add_child(restart)
	var footer_clearance := Control.new()
	footer_clearance.custom_minimum_size.y = 44
	drawer_content.add_child(footer_clearance)
	_refresh_stats()
	_move_interface()
	queue_redraw()

func _create_header() -> void:
	header = PanelContainer.new()
	header.add_theme_stylebox_override("panel", _ornament_style(HEADER_FRAME, 0, 0))
	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 18)
	margin.add_theme_constant_override("margin_right", 16)
	margin.add_theme_constant_override("margin_top", 21)
	margin.add_theme_constant_override("margin_bottom", 8)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 10)
	var stage := _small_label("TAPPA 1", 11, OCHRE)
	stage.custom_minimum_size.x = 54
	row.add_child(stage)
	var divider := VSeparator.new()
	divider.custom_minimum_size.x = 1
	row.add_child(divider)
	header_title = _small_label("", 18, Color("#fff6e5"))
	header_title.add_theme_font_override("font", SERIF_SEMIBOLD)
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
	stats_bar.custom_minimum_size.y = 58
	stats_bar.add_theme_stylebox_override("panel", _panel_style(Color("#0d3035f5"), Color("#60777a"), 10, 1))
	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 7)
	margin.add_theme_constant_override("margin_right", 7)
	margin.add_theme_constant_override("margin_top", 6)
	margin.add_theme_constant_override("margin_bottom", 6)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 0)
	var icon_kinds := ["sun", "bolt", "heart", "coins"]
	var icon_colors := [OCHRE, OCHRE, Color("#e76f51"), OCHRE]
	for index in range(4):
		var cell := HBoxContainer.new()
		cell.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		cell.alignment = BoxContainer.ALIGNMENT_CENTER
		cell.add_theme_constant_override("separation", 5)
		var icon: Control = StatIconControl.new().setup(icon_kinds[index], icon_colors[index])
		icon.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		cell.add_child(icon)
		var text_stack := VBoxContainer.new()
		text_stack.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		text_stack.add_theme_constant_override("separation", 3)
		var value := _small_label("", 11, Color("#f3ead8"))
		value.add_theme_font_override("font", SERIF_SEMIBOLD)
		value.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		text_stack.add_child(value)
		var bar := ProgressBar.new()
		bar.show_percentage = false
		bar.max_value = 100
		bar.custom_minimum_size = Vector2(46, 5)
		bar.add_theme_stylebox_override("background", _bar_style(Color("#263f42")))
		bar.add_theme_stylebox_override("fill", _bar_style(MOSS if index == 1 else Color("#e76f51")))
		text_stack.add_child(bar)
		cell.add_child(text_stack)
		row.add_child(cell)
		stat_values.append(value)
		stat_bars.append(bar)
		stat_icons.append(icon)
		if index < 3:
			var divider := VSeparator.new()
			divider.modulate = Color(1, 1, 1, .25)
			divider.custom_minimum_size.x = 1
			row.add_child(divider)
	margin.add_child(row)
	stats_bar.add_child(margin)
	add_child(stats_bar)

func _create_drawer() -> void:
	drawer = PanelContainer.new()
	drawer.add_theme_stylebox_override("panel", _paper_style())
	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 19)
	margin.add_theme_constant_override("margin_right", 19)
	margin.add_theme_constant_override("margin_top", 12)
	margin.add_theme_constant_override("margin_bottom", 9)
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
	var values := [GameState.clock_text(), "Energia %d" % GameState.energy, "Morale %d" % GameState.morale, "%d €" % GameState.money]
	var kinds := ["sun", "bolt", "heart", "coins"]
	var colors := [OCHRE, OCHRE, Color("#e76f51"), OCHRE]
	var bar_values := [-1, GameState.energy, GameState.morale, -1]
	if finished:
		values = ["Energia %d" % GameState.energy, "Morale %d" % GameState.morale, "%d €" % GameState.money, "Sauna fatta" if sauna_used else "Sauna aperta"]
		kinds = ["bolt", "heart", "coins", "steam"]
		colors = [OCHRE, Color("#e76f51"), OCHRE, Color("#a6c65a")]
		bar_values = [GameState.energy, GameState.morale, -1, -1]
	for index in range(4):
		stat_values[index].text = values[index]
		stat_icons[index].set("kind", kinds[index])
		stat_icons[index].set("accent", colors[index])
		stat_icons[index].queue_redraw()
		stat_bars[index].visible = bar_values[index] >= 0
		if bar_values[index] >= 0: stat_bars[index].value = bar_values[index]

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
	card_row.add_theme_constant_override("separation", 8)
	card_row.clip_contents = true
	var copy := VBoxContainer.new()
	copy.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	copy.size_flags_stretch_ratio = 1.0
	copy.add_theme_constant_override("separation", 2)
	copy.add_child(_small_label(str(POI[poi].kicker), 10, RUST))
	copy.add_child(_title_label(str(POI[poi].event_title), 24))
	copy.add_child(_body_label(str(POI[poi].body)))
	card_row.add_child(copy)
	var illustration := TextureRect.new()
	illustration.texture = load(str(POI[poi].card))
	illustration.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	illustration.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	illustration.custom_minimum_size = Vector2(66, 76)
	illustration.size_flags_horizontal = Control.SIZE_SHRINK_END
	card_row.add_child(illustration)
	drawer_content.add_child(card_row)
	for choice in POI[poi].choices:
		drawer_content.add_child(_choice_button(choice))
	var spacer := Control.new()
	spacer.size_flags_vertical = Control.SIZE_EXPAND_FILL
	drawer_content.add_child(spacer)

func _build_walking_drawer() -> void:
	clear_children(drawer_content)
	drawer_content.add_child(_small_label("IN CAMMINO · TRATTO %d DI 6" % (poi + 1), 10, RUST))
	drawer_content.add_child(_title_label(str(POI[poi].walking_title), 28))
	drawer_content.add_child(_body_label(str(POI[poi].walking_body)))
	var line := HSeparator.new()
	line.modulate = Color(RUST, .40)
	drawer_content.add_child(line)
	var progress := _small_label(str(POI[poi].walking_note), 12, SOFT)
	progress.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	drawer_content.add_child(progress)
	var spacer := Control.new()
	spacer.size_flags_vertical = Control.SIZE_EXPAND_FILL
	drawer_content.add_child(spacer)
	var footer_clearance := Control.new()
	footer_clearance.custom_minimum_size.y = 42
	drawer_content.add_child(footer_clearance)

func _choice_button(choice: Dictionary, emits_choice := true) -> Button:
	var result := Button.new()
	result.custom_minimum_size.y = 72
	var featured := str(choice.get("tag", "")) == "SAUNA"
	result.add_theme_stylebox_override("normal", _choice_style(Color("#fff0cf") if featured else Color("#f3e7cd"), OCHRE if featured else Color("#c8b690"), 2 if featured else 1))
	result.add_theme_stylebox_override("hover", _choice_style(Color("#fff4da"), OCHRE, 2))
	result.add_theme_stylebox_override("pressed", _choice_style(Color("#e7d7b8"), RUST, 2))
	var row := HBoxContainer.new()
	row.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	row.offset_left = 11
	row.offset_right = -11
	row.offset_top = 5
	row.offset_bottom = -5
	row.mouse_filter = Control.MOUSE_FILTER_IGNORE
	row.add_theme_constant_override("separation", 9)
	var icon_path := str(choice.get("icon", ""))
	if not icon_path.is_empty():
		var icon := TextureRect.new()
		icon.texture = load(icon_path)
		icon.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		icon.custom_minimum_size = Vector2(54, 54)
		row.add_child(icon)
	var copy := VBoxContainer.new()
	copy.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	copy.alignment = BoxContainer.ALIGNMENT_CENTER
	copy.add_theme_constant_override("separation", 0)
	var title := _small_label(str(choice.get("title", "Scelta")), 15, INK)
	title.add_theme_font_override("font", SERIF_SEMIBOLD)
	title.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	copy.add_child(title)
	var detail := _small_label(str(choice.get("detail", "")), 11, SOFT)
	detail.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	detail.max_lines_visible = 2
	copy.add_child(detail)
	row.add_child(copy)
	var arrow := _small_label("›", 29, RUST)
	arrow.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	row.add_child(arrow)
	result.add_child(row)
	if emits_choice: result.pressed.connect(func(): choice_selected.emit(choice))
	return result

func _choice_style(fill: Color, border: Color, width: int) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = fill
	style.border_color = border
	style.set_border_width_all(width)
	style.set_corner_radius_all(7)
	style.shadow_color = Color(0.20, .14, .08, .13)
	style.shadow_size = 3
	style.shadow_offset = Vector2(0, 2)
	style.content_margin_left = 10
	style.content_margin_right = 10
	style.content_margin_top = 6
	style.content_margin_bottom = 6
	return style

func _shortcut_row() -> HBoxContainer:
	var row := HBoxContainer.new()
	row.alignment = BoxContainer.ALIGNMENT_CENTER
	row.add_theme_constant_override("separation", 34)
	var notebook := Button.new()
	notebook.custom_minimum_size = Vector2(88, 42)
	notebook.flat = true
	notebook.add_child(_shortcut_content("TACCUINO", "res://assets/sprites/event/taccuino.png"))
	row.add_child(notebook)
	var divider := VSeparator.new()
	divider.custom_minimum_size.y = 28
	row.add_child(divider)
	var pack := Button.new()
	pack.custom_minimum_size = Vector2(88, 42)
	pack.flat = true
	pack.add_child(_shortcut_content("ZAINO", "res://assets/sprites/event/zaino.png"))
	pack.pressed.connect(func(): pack_requested.emit())
	row.add_child(pack)
	return row

func _shortcut_content(title: String, icon_path: String) -> HBoxContainer:
	var content := HBoxContainer.new()
	content.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	content.mouse_filter = Control.MOUSE_FILTER_IGNORE
	content.alignment = BoxContainer.ALIGNMENT_CENTER
	content.add_theme_constant_override("separation", 4)
	var icon := TextureRect.new()
	icon.texture = load(icon_path)
	icon.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	icon.custom_minimum_size = Vector2(24, 28)
	content.add_child(icon)
	var caption := _small_label(title, 11, INK)
	caption.add_theme_font_override("font", SERIF_SEMIBOLD)
	caption.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	content.add_child(caption)
	return content

func _layout_interface() -> void:
	if size.x <= 0 or not header: return
	header.position = Vector2.ZERO
	header.size = Vector2(size.x, 82)
	drawer.size.x = size.x - 20
	drawer.position.x = 10
	stats_bar.size.x = size.x - 24
	stats_bar.size.y = 58
	stats_bar.position.x = 12
	footer_bar.size = Vector2(220, 42)
	footer_bar.position = Vector2((size.x - footer_bar.size.x) * .5, size.y - 45)
	_move_interface(true)

func _move_interface(immediate := false) -> void:
	if not drawer or size.y <= 0: return
	var drawer_height := 450.0
	if walking: drawer_height = 280.0
	if finished: drawer_height = 515.0 if not finish_resolved else 310.0
	var height_limit := size.y * (.64 if finished and not finish_resolved else .56)
	drawer_height = minf(drawer_height, height_limit)
	drawer.size.y = drawer_height
	var drawer_y := size.y - drawer_height
	var stats_y := drawer_y - 64.0
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
		var scene_rect := Rect2(Vector2(0, 64), Vector2(size.x, scene_bottom - 64.0))
		_draw_texture_cover(background, scene_rect)
	_draw_atmosphere()

func _draw_texture_cover(texture: Texture2D, target: Rect2) -> void:
	var texture_size := texture.get_size()
	if texture_size.x <= 0 or texture_size.y <= 0: return
	var factor := maxf(target.size.x / texture_size.x, target.size.y / texture_size.y)
	var source_size := target.size / factor
	var breathing := 1.0 - (sin(time * .22) + 1.0) * .0025
	source_size *= breathing
	var source_position := (texture_size - source_size) * .5
	# Un movimento lentissimo da camera rende vivo il quadro senza deformarlo.
	var drift_room := maxf(0.0, (texture_size.x - source_size.x) * .45)
	source_position.x += sin(time * .16) * minf(drift_room, texture_size.x * .008)
	source_position.y += cos(time * .13) * minf(maxf(0.0, (texture_size.y - source_size.y) * .35), texture_size.y * .004)
	draw_texture_rect_region(texture, target, Rect2(source_position, source_size))

func _draw_atmosphere() -> void:
	# Niente particelle generiche sopra i quadri: il movimento di camera è sufficiente.
	# A Vuolle resta soltanto il fumo, ancorato al vero camino della sauna.
	if not stats_bar or not finished: return
	var top := 64.0
	var bottom := stats_bar.position.y
	var scene_height := maxf(120.0, bottom - top)
	var chimney := Vector2(size.x * .855, top + scene_height * .185)
	for strand in range(2):
		var smoke_line := PackedVector2Array()
		for step in range(9):
			var sway := sin(time * 1.05 + step * .58 + strand * 1.8) * (1.5 + step * .55)
			smoke_line.append(chimney + Vector2(strand * 3.5 + sway, -step * 6.0))
		draw_polyline(smoke_line, Color(.95,.95,.89,.34), 2.2, true)
	for index in range(7):
		var rise := fmod(time * 11.0 + index * 9.0, scene_height * .24)
		var progress := rise / (scene_height * .24)
		var smoke_center := chimney + Vector2(sin(time * .65 + index * 1.4) * (2.0 + progress * 7.0) + rise * .06, -rise)
		draw_circle(smoke_center, 3.5 + progress * 7.5, Color(.94,.94,.88,.27 * (1.0 - progress)))

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

func _bar_style(fill: Color) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = fill
	style.set_corner_radius_all(2)
	return style

func _ornament_style(path: String, horizontal_margin: float, vertical_margin: float, content_horizontal := 8.0, content_vertical := 6.0) -> StyleBoxTexture:
	var style := StyleBoxTexture.new()
	style.texture = load(path)
	style.set_texture_margin(SIDE_LEFT, horizontal_margin)
	style.set_texture_margin(SIDE_RIGHT, horizontal_margin)
	style.set_texture_margin(SIDE_TOP, vertical_margin)
	style.set_texture_margin(SIDE_BOTTOM, vertical_margin)
	style.set_content_margin(SIDE_LEFT, content_horizontal)
	style.set_content_margin(SIDE_RIGHT, content_horizontal)
	style.set_content_margin(SIDE_TOP, content_vertical)
	style.set_content_margin(SIDE_BOTTOM, content_vertical)
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
	result.add_theme_font_override("font", SERIF)
	return result

func _title_label(text_value: String, size_px: int) -> Label:
	var result := _small_label(text_value, size_px, INK)
	result.add_theme_font_override("font", SERIF_SEMIBOLD)
	result.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	return result

func _body_label(text_value: String) -> Label:
	var result := _small_label(text_value, 13, SOFT)
	result.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	result.max_lines_visible = 2
	return result

func clear_children(parent: Node) -> void:
	for child in parent.get_children():
		parent.remove_child(child)
		child.queue_free()
