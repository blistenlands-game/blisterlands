class_name TrailView
extends Control

signal choice_selected(choice: Dictionary)
signal outcome_acknowledged
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
			{"title":"Riempi la borraccia", "energy":1, "morale":1, "minutes":10, "tag":"ACQUA", "detail":"Energia +1 · Morale +1 · 10 min", "outcome":"Ti inginocchi fra gli spruzzi. L’acqua è gelida, pulita e cancella per un momento la fatica dalle mani."},
			{"title":"Fermati ad ascoltare", "energy":-1, "morale":3, "minutes":15, "tag":"CALMA", "detail":"Energia −1 · Morale +3 · 15 min", "outcome":"Resti immobile accanto alla cascata. Quando riparti, il fragore non è più rumore: è il ritmo del cammino."},
			{"title":"Continua sul sentiero", "energy":0, "morale":0, "minutes":0, "tag":"PASSA", "detail":"Nessun costo immediato", "outcome":"Lasci la cascata alle spalle senza fermarti. Il sentiero continua a risalire il torrente."},
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
			{"title":"Bevi alla sorgente", "energy":4, "morale":1, "minutes":5, "tag":"BEVI", "detail":"Energia +4 · Morale +1 · 5 min", "outcome":"L’acqua sa di pietra e neve. La bevi lentamente e senti il freddo scendere fino allo stomaco."},
			{"title":"Bagna il viso", "energy":1, "morale":2, "minutes":10, "tag":"SOSTA", "detail":"Energia +1 · Morale +2 · 10 min", "outcome":"Il gelo ti mozza il respiro, poi ti rimette completamente sveglio. Riparti con il viso ancora bagnato."},
			{"title":"Passa oltre", "energy":0, "morale":0, "minutes":0, "tag":"PASSA", "detail":"Nessun costo immediato", "outcome":"Non tocchi l’acqua immobile. Segui il rivolo finché scompare sotto le pietre."},
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
			{"title":"Segui le orme", "energy":-3, "morale":4, "minutes":20, "tag":"RISCHIO", "detail":"Rischio medio · Energia −3 · Morale +4 · 20 min", "outcome":"Le orme portano fra le betulle. Per un istante intravedi il dorso scuro di un alce, poi il bosco lo richiude."},
			{"title":"Fai silenzio e aspetta", "energy":-1, "morale":2, "minutes":15, "tag":"ATTENDI", "detail":"Energia −1 · Morale +2 · 15 min", "outcome":"Aspetti senza muoverti. Un ramo si piega, qualcosa respira oltre le foglie, ma non si mostra."},
			{"title":"Resta sul sentiero", "energy":0, "morale":0, "minutes":0, "tag":"PASSA", "detail":"Scelta prudente · nessun costo", "outcome":"Non lasci la traccia battuta. Le impronte ti accompagnano per qualche metro e poi spariscono nel fango."},
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
			{"title":"Raccogli una manciata", "energy":2, "morale":3, "minutes":15, "tag":"RACCOGLI", "detail":"Energia +2 · Morale +3 · 15 min", "outcome":"Le bacche sono piccole, aspre e dolcissime. Le dita restano blu mentre il vento scuote gli arbusti."},
			{"title":"Fermati per una foto", "energy":-1, "morale":2, "minutes":10, "tag":"RICORDO", "detail":"Energia −1 · Morale +2 · 10 min", "outcome":"Aspetti che una raffica passi e scatti. Nella foto il pendio sembra immobile; tu ricordi quanto si muoveva."},
			{"title":"Continua a salire", "energy":0, "morale":0, "minutes":0, "tag":"PASSA", "detail":"Nessun costo immediato", "outcome":"Lasci i mirtilli agli uccelli e continui verso il crinale, con il lago che compare poco a poco."},
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
			{"title":"Controlla il capanno", "energy":-2, "morale":3, "minutes":15, "tag":"CERCA", "detail":"Rischio medio · Energia −2 · Morale +3 · 15 min", "outcome":"La porta è socchiusa. Dentro trovi reti asciutte, una tazza capovolta e nessuno: il pescatore è già sul lago."},
			{"title":"Riposa sul pontile", "energy":3, "morale":2, "minutes":20, "tag":"RIPOSA", "detail":"Energia +3 · Morale +2 · 20 min", "outcome":"Il pontile cede appena sotto il tuo peso. La barca dondola e per venti minuti non serve andare da nessuna parte."},
			{"title":"Prosegui verso Vuolle", "energy":0, "morale":0, "minutes":0, "tag":"PASSA", "detail":"Nessun costo immediato", "outcome":"Superi il capanno senza fermarti. Dietro di te la barca continua a battere piano contro il legno."},
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
			{"title":"Raggiungi Rifugio Vuolle", "energy":-2, "morale":5, "minutes":10, "tag":"ARRIVA", "detail":"Energia −2 · Morale +5 · 10 min", "outcome":"Scendi gli ultimi tornanti. Le finestre accese si avvicinano e dal camino della sauna arriva odore di legna."},
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
const ChoiceIconControl := preload("res://godot/scripts/choice_icon.gd")
const FooterOrnamentControl := preload("res://godot/scripts/footer_ornament.gd")
const HEADER_FRAME := "res://assets/ui/header-frame-v2.png"
const CHOICE_FRAME := "res://assets/ui/choice-paper-v2.png"
const MOCKUP_CHOICE_FRAME := "res://assets/ui/choice-card-mockup-v1.png"
const MOCKUP_PANEL_FRAME := "res://assets/ui/event-panel-mockup-v1.png"

var poi := 0
var walking := false
var showing_outcome := false
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
var footer_bar: Control
var footer_note: Label
var footer_sprig: Control
var footer_mountains: Control
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
	showing_outcome = false
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
	showing_outcome = false
	if walking: _build_walking_drawer()
	else: _build_event_drawer()
	_move_interface()
	queue_redraw()

func show_choice_outcome(choice: Dictionary) -> void:
	walking = false
	showing_outcome = true
	clear_children(drawer_content)
	drawer_content.add_child(_small_label("ESITO · %s" % str(choice.get("tag", "SCELTA")), 10, RUST))
	drawer_content.add_child(_title_label(str(choice.get("title", "Scelta")), 28))
	var outcome := _body_label(str(choice.get("outcome", "La scelta cambia il passo con cui riprendi il cammino.")))
	outcome.max_lines_visible = 4
	outcome.add_theme_font_size_override("font_size", 14)
	drawer_content.add_child(outcome)
	var rule := HSeparator.new()
	rule.modulate = Color(RUST, .35)
	drawer_content.add_child(rule)
	drawer_content.add_child(_small_label(str(choice.get("detail", "")), 12, MOSS))
	var continue_choice := {"title":"Riprendi il cammino", "tag":"CONTINUA", "detail":"Prosegui verso il prossimo punto di interesse"}
	var continue_button := _choice_button(continue_choice, false)
	continue_button.pressed.connect(func(): outcome_acknowledged.emit())
	drawer_content.add_child(continue_button)
	var footer_clearance := Control.new()
	footer_clearance.custom_minimum_size.y = 40
	drawer_content.add_child(footer_clearance)
	_refresh_stats()
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
		{"title":"Pavimento", "energy":20, "morale":2, "money":-15, "tag":"15 €", "detail":"Recupero ridotto · al caldo", "icon":"res://assets/sprites/gear/matSchiuma.png"},
		{"title":"Tenda", "energy":10, "morale":0, "money":0, "tag":"GRATIS", "detail":"Recupero minimo · notte all’aperto", "icon":"res://assets/sprites/gear/tenda.png"},
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
	margin.add_theme_constant_override("margin_left", 20)
	margin.add_theme_constant_override("margin_right", 18)
	margin.add_theme_constant_override("margin_top", 9)
	margin.add_theme_constant_override("margin_bottom", 8)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 12)
	var stage := _small_label("TAPPA 1", 13, OCHRE)
	stage.custom_minimum_size = Vector2(67, 38)
	stage.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	stage.size_flags_vertical = Control.SIZE_EXPAND_FILL
	row.add_child(stage)
	var divider := VSeparator.new()
	divider.custom_minimum_size = Vector2(1, 38)
	divider.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	row.add_child(divider)
	header_title = _small_label("", 17, Color("#fff6e5"))
	header_title.add_theme_font_override("font", SERIF_SEMIBOLD)
	header_title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	header_title.size_flags_vertical = Control.SIZE_EXPAND_FILL
	header_title.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	header_title.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	row.add_child(header_title)
	header_progress = _small_label("", 13, Color("#eee3cd"))
	header_progress.custom_minimum_size = Vector2(70, 38)
	header_progress.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	header_progress.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	header_progress.size_flags_vertical = Control.SIZE_EXPAND_FILL
	header_dots = _small_label("", 1, Color.TRANSPARENT)
	row.add_child(header_progress)
	margin.add_child(row)
	header.add_child(margin)
	add_child(header)

func _create_stats() -> void:
	stats_bar = PanelContainer.new()
	stats_bar.custom_minimum_size.y = 42
	stats_bar.add_theme_stylebox_override("panel", _panel_style(Color("#102e33f2"), Color("#53686a"), 5, 1))
	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 9)
	margin.add_theme_constant_override("margin_right", 9)
	margin.add_theme_constant_override("margin_top", 3)
	margin.add_theme_constant_override("margin_bottom", 3)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 0)
	var icon_kinds := ["sun", "bolt", "heart", "boot"]
	var icon_colors := [OCHRE, OCHRE, Color("#bd684f"), OCHRE]
	for index in range(4):
		if index > 0:
			var separator := VSeparator.new()
			separator.custom_minimum_size = Vector2(1, 26)
			separator.modulate = Color("#8b99917a")
			row.add_child(separator)
		var cell := HBoxContainer.new()
		cell.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		cell.alignment = BoxContainer.ALIGNMENT_CENTER
		cell.add_theme_constant_override("separation", 3)
		var icon: Control = StatIconControl.new().setup(icon_kinds[index], icon_colors[index])
		icon.custom_minimum_size = Vector2(18, 18)
		icon.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		cell.add_child(icon)
		var text_stack := VBoxContainer.new()
		text_stack.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		var value := _small_label("", 10, Color("#f3ead8"))
		value.add_theme_font_override("font", SERIF_SEMIBOLD)
		value.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		text_stack.add_child(value)
		var bar := ProgressBar.new()
		bar.show_percentage = false
		bar.max_value = 100
		bar.custom_minimum_size = Vector2(0, 0)
		bar.visible = false
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
	margin.add_theme_constant_override("margin_left", 30)
	margin.add_theme_constant_override("margin_right", 18)
	margin.add_theme_constant_override("margin_top", 20)
	margin.add_theme_constant_override("margin_bottom", 18)
	drawer_content = VBoxContainer.new()
	drawer_content.add_theme_constant_override("separation", 4)
	margin.add_child(drawer_content)
	drawer.add_child(margin)
	add_child(drawer)
	footer_bar = _shortcut_row()
	add_child(footer_bar)
	footer_sprig = FooterOrnamentControl.new().setup("sprig")
	footer_sprig.custom_minimum_size = Vector2(52, 56)
	add_child(footer_sprig)
	footer_mountains = FooterOrnamentControl.new().setup("mountains")
	footer_mountains.custom_minimum_size = Vector2(56, 34)
	add_child(footer_mountains)
	footer_note = _small_label("Più lontano.\nPiù tuo.", 12, Color("#8f4b35"))
	footer_note.add_theme_font_override("font", HAND)
	footer_note.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	footer_note.rotation = -.08
	add_child(footer_note)

func _refresh_header() -> void:
	header_title.text = str(POI[poi].title)
	header_progress.text = "%d / 6" % (poi + 1)
	header_dots.text = ""

func _refresh_stats() -> void:
	var remaining_km := maxi(0, 14 - poi * 2)
	var values := [GameState.clock_text(), "Energia  %d" % GameState.energy, "Morale  %d" % GameState.morale, "%d km" % remaining_km]
	var kinds := ["sun", "bolt", "heart", "boot"]
	var colors := [OCHRE, OCHRE, Color("#bd684f"), OCHRE]
	var bar_values := [-1, -1, -1, -1]
	if finished:
		values = [GameState.clock_text(), "Energia  %d" % GameState.energy, "Morale  %d" % GameState.morale, "14 km"]
		kinds = ["sun", "bolt", "heart", "boot"]
		colors = [OCHRE, OCHRE, Color("#bd684f"), OCHRE]
	for index in range(4):
		stat_values[index].text = values[index]
		stat_icons[index].set("kind", kinds[index])
		stat_icons[index].set("accent", colors[index])
		stat_icons[index].queue_redraw()
		stat_bars[index].visible = bar_values[index] >= 0
		if bar_values[index] >= 0: stat_bars[index].value = bar_values[index]

func _build_event_drawer() -> void:
	clear_children(drawer_content)
	var card_row := HBoxContainer.new()
	card_row.custom_minimum_size.y = 166
	card_row.add_theme_constant_override("separation", 8)
	card_row.clip_contents = true
	var copy := VBoxContainer.new()
	copy.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	copy.size_flags_stretch_ratio = 1.0
	copy.add_theme_constant_override("separation", 2)
	copy.add_child(_small_label("—  %s" % str(POI[poi].kicker), 10, RUST))
	copy.add_child(_title_label(str(POI[poi].event_title), 28))
	var title_rule := HSeparator.new()
	title_rule.custom_minimum_size.x = 28
	title_rule.modulate = Color(RUST, .55)
	copy.add_child(title_rule)
	var body := _body_label(str(POI[poi].body))
	body.max_lines_visible = 5
	body.add_theme_font_size_override("font_size", 15)
	copy.add_child(body)
	card_row.add_child(copy)
	var illustration := TextureRect.new()
	illustration.texture = load(str(POI[poi].card))
	illustration.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	illustration.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	illustration.custom_minimum_size = Vector2(112, 150)
	illustration.size_flags_horizontal = Control.SIZE_SHRINK_END
	card_row.add_child(illustration)
	drawer_content.add_child(card_row)
	for index in range(POI[poi].choices.size()):
		drawer_content.add_child(_event_choice_button(POI[poi].choices[index], index))
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

func _event_choice_button(choice: Dictionary, index: int) -> Button:
	var result := Button.new()
	result.custom_minimum_size.y = 58
	for state in ["normal", "hover", "pressed"]:
		result.add_theme_stylebox_override(state, _ornament_style(MOCKUP_CHOICE_FRAME, 96, 72, 11, 7))
	var row := HBoxContainer.new()
	row.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	row.offset_left = 11
	row.offset_right = -11
	row.offset_top = 5
	row.offset_bottom = -5
	row.mouse_filter = Control.MOUSE_FILTER_IGNORE
	row.add_theme_constant_override("separation", 8)
	var kinds := ["speak", "scatter", "avoid"]
	var icon_color := MOSS if index == 2 else RUST
	var choice_icon: Control = ChoiceIconControl.new().setup(kinds[min(index, 2)], icon_color)
	choice_icon.custom_minimum_size = Vector2(34, 34)
	choice_icon.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	row.add_child(choice_icon)
	var title := _small_label(str(choice.get("title", "Scelta")), 14, INK)
	title.add_theme_font_override("font", SERIF_SEMIBOLD)
	title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	title.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	title.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	row.add_child(title)
	var risk_count := maxi(1, 3 - index)
	var risk := _small_label("●".repeat(risk_count), 13, MOSS if risk_count == 1 else RUST)
	risk.custom_minimum_size.x = 48
	risk.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	risk.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	row.add_child(risk)
	var arrow := _small_label("→", 23, INK)
	arrow.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	row.add_child(arrow)
	result.add_child(row)
	result.pressed.connect(func(): choice_selected.emit(choice))
	return result

func _choice_button(choice: Dictionary, emits_choice := true) -> Button:
	var result := Button.new()
	result.custom_minimum_size.y = 68
	var featured := str(choice.get("tag", "")) == "SAUNA"
	result.add_theme_stylebox_override("normal", _choice_style(Color("#fff1d5") if featured else Color("#f5ead3"), OCHRE if featured else Color("#d3c5a8"), 2 if featured else 1))
	result.add_theme_stylebox_override("hover", _choice_style(Color("#fff5df"), OCHRE, 2))
	result.add_theme_stylebox_override("pressed", _choice_style(Color("#eadcbe"), RUST, 2))
	var row := HBoxContainer.new()
	row.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	row.offset_left = 12
	row.offset_right = -12
	row.offset_top = 4
	row.offset_bottom = -4
	row.mouse_filter = Control.MOUSE_FILTER_IGNORE
	row.add_theme_constant_override("separation", 7)
	var icon_path := str(choice.get("icon", ""))
	if not icon_path.is_empty():
		var icon := TextureRect.new()
		icon.texture = load(icon_path)
		icon.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		icon.custom_minimum_size = Vector2(42, 46)
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
	detail.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	detail.max_lines_visible = 1
	copy.add_child(detail)
	row.add_child(copy)
	var action := _small_label(str(choice.get("tag", "")), 10, RUST)
	action.custom_minimum_size.x = 42
	action.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	action.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	row.add_child(action)
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
	row.add_theme_constant_override("separation", 28)
	var notebook := Button.new()
	notebook.custom_minimum_size = Vector2(78, 64)
	notebook.flat = true
	notebook.add_child(_shortcut_content("Taccuino", "res://assets/sprites/event/taccuino.png"))
	row.add_child(notebook)
	var divider := VSeparator.new()
	divider.custom_minimum_size.y = 50
	row.add_child(divider)
	var pack := Button.new()
	pack.custom_minimum_size = Vector2(78, 64)
	pack.flat = true
	pack.add_child(_shortcut_content("Zaino", "res://assets/sprites/event/zaino.png"))
	pack.pressed.connect(func(): pack_requested.emit())
	row.add_child(pack)
	return row

func _shortcut_content(title: String, icon_path: String) -> VBoxContainer:
	var content := VBoxContainer.new()
	content.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	content.mouse_filter = Control.MOUSE_FILTER_IGNORE
	content.alignment = BoxContainer.ALIGNMENT_CENTER
	content.add_theme_constant_override("separation", 0)
	var icon := TextureRect.new()
	icon.texture = load(icon_path)
	icon.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	icon.custom_minimum_size = Vector2(28, 34)
	icon.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
	content.add_child(icon)
	var caption := _small_label(title, 11, INK)
	caption.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	caption.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	content.add_child(caption)
	return content

func _layout_interface() -> void:
	if size.x <= 0 or not header: return
	header.position = Vector2.ZERO
	header.size = Vector2(size.x, 64)
	drawer.size.x = size.x - 2
	drawer.position.x = 1
	stats_bar.size.x = size.x - 18
	stats_bar.size.y = 42
	stats_bar.position.x = 9
	footer_bar.size = Vector2(230, 70)
	footer_bar.position = Vector2((size.x - footer_bar.size.x) * .5, size.y - 75)
	footer_sprig.position = Vector2(16, size.y - 70)
	footer_sprig.size = Vector2(48, 55)
	footer_mountains.position = Vector2(size.x - 72, size.y - 72)
	footer_mountains.size = Vector2(54, 32)
	footer_note.position = Vector2(size.x - 88, size.y - 43)
	footer_note.size = Vector2(76, 35)
	_move_interface(true)

func _move_interface(immediate := false) -> void:
	if not drawer or size.y <= 0: return
	var drawer_height := 475.0
	if walking: drawer_height = 280.0
	if showing_outcome: drawer_height = 360.0
	if finished: drawer_height = 515.0 if not finish_resolved else 310.0
	var height_limit := size.y * (.64 if finished and not finish_resolved else .56)
	drawer_height = minf(drawer_height, height_limit)
	drawer.size.y = drawer_height
	var drawer_y := size.y - drawer_height
	var stats_y := drawer_y - 46.0
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
		_draw_scene_animation(scene_rect)

func _draw_texture_cover(texture: Texture2D, target: Rect2) -> void:
	var texture_size := texture.get_size()
	if texture_size.x <= 0 or texture_size.y <= 0: return
	var factor := maxf(target.size.x / texture_size.x, target.size.y / texture_size.y)
	var source_size := target.size / factor
	var breathing := 1.0 - (sin(time * .42) + 1.0) * .010
	source_size *= breathing
	var source_position := (texture_size - source_size) * .5
	# Il quadro respira con un movimento di camera percepibile ma senza deformazioni.
	var drift_room := maxf(0.0, (texture_size.x - source_size.x) * .45)
	source_position.x += sin(time * .24) * minf(drift_room, texture_size.x * .018)
	source_position.y += cos(time * .19) * minf(maxf(0.0, (texture_size.y - source_size.y) * .35), texture_size.y * .010)
	draw_texture_rect_region(texture, target, Rect2(source_position, source_size))

func _draw_scene_animation(scene: Rect2) -> void:
	if finished:
		_draw_finish_animation(scene)
		return
	match poi:
		0: _draw_waterfall_animation(scene)
		1: _draw_spring_animation(scene)
		2: _draw_birch_animation(scene)
		3: _draw_berry_animation(scene)
		4: _draw_bay_animation(scene)
		5: _draw_belvedere_animation(scene)

func _scene_point(scene: Rect2, x: float, y: float) -> Vector2:
	return scene.position + Vector2(scene.size.x * x, scene.size.y * y)

func _draw_waterfall_animation(scene: Rect2) -> void:
	# Fili d'acqua rapidi e schiuma pulsante seguono i tre salti della cascata.
	for index in range(11):
		var phase := fmod(time * 115.0 + index * 29.0, scene.size.y * .43)
		var start := _scene_point(scene, .39 + index * .012, .10) + Vector2(sin(time * 2.2 + index) * 2.5, phase)
		var length := 15.0 + float(index % 4) * 5.0
		draw_line(start, start + Vector2(4.0, length), Color(.78,.95,1.0,.60), 2.0, true)
	for index in range(9):
		var foam := _scene_point(scene, .48 + sin(index * 2.1) * .13, .55 + cos(index * 1.7) * .035)
		var pulse := 1.3 + (sin(time * 3.0 + index) + 1.0) * .9
		draw_circle(foam, pulse, Color(.92,.98,1.0,.42))

func _draw_spring_animation(scene: Rect2) -> void:
	var center := _scene_point(scene, .53, .52)
	for index in range(4):
		var radius := fmod(time * 24.0 + index * 18.0, 72.0)
		var alpha := .52 * (1.0 - radius / 72.0)
		draw_arc(center, radius, 0.0, TAU, 48, Color(.76,.94,1.0,alpha), 2.0, true)
	for index in range(5):
		var glint := _scene_point(scene, .38 + index * .08, .47 + sin(time * 1.7 + index) * .025)
		draw_line(glint - Vector2(5,0), glint + Vector2(5,0), Color(1,1,.88,.48), 1.6, true)

func _draw_birch_animation(scene: Rect2) -> void:
	for index in range(15):
		var travel := fmod(time * (34.0 + index % 3 * 7.0) + index * 41.0, scene.size.x + 80.0)
		var leaf := Vector2(scene.end.x + 30.0 - travel, scene.position.y + 35.0 + fmod(index * 37.0, scene.size.y * .72))
		leaf.y += sin(time * 3.0 + index) * 11.0
		var color := Color("#d4a936") if index % 3 else Color("#8c993f")
		color.a = .72
		draw_colored_polygon(PackedVector2Array([leaf + Vector2(-4,0), leaf + Vector2(0,-2), leaf + Vector2(5,1), leaf + Vector2(0,3)]), color)

func _draw_berry_animation(scene: Rect2) -> void:
	for index in range(18):
		var position := _scene_point(scene, .12 + fmod(index * .173, .78), .45 + fmod(index * .117, .36))
		var pulse := (sin(time * 2.4 + index * 1.8) + 1.0) * .5
		draw_circle(position, 1.4 + pulse * 2.1, Color(.45,.60,1.0,.28 + pulse * .42))
	for index in range(4):
		var grass := _scene_point(scene, .25 + index * .17, .63)
		draw_line(grass, grass + Vector2(sin(time * 2.0 + index) * 5.0, -18.0), Color(.84,.72,.31,.50), 1.4, true)

func _draw_bay_animation(scene: Rect2) -> void:
	for index in range(9):
		var y := scene.position.y + scene.size.y * (.47 + index * .045)
		var offset := fmod(time * (18.0 + index), 46.0)
		for segment in range(5):
			var x := scene.position.x + scene.size.x * .43 + segment * 54.0 + offset
			draw_line(Vector2(x,y), Vector2(x + 25.0,y + sin(time * 2.0 + segment) * 1.8), Color(.80,.95,1.0,.38), 1.5, true)
	# Due uccelli attraversano lentamente il cielo del lago.
	for bird in range(2):
		var bx := scene.position.x + fmod(time * 29.0 + bird * 170.0, scene.size.x + 50.0) - 25.0
		var by := scene.position.y + 48.0 + bird * 24.0
		draw_arc(Vector2(bx - 5,by), 6, PI * 1.05, PI * 1.85, 8, Color(.10,.13,.13,.65), 1.5, true)
		draw_arc(Vector2(bx + 5,by), 6, PI * 1.15, PI * 1.95, 8, Color(.10,.13,.13,.65), 1.5, true)

func _draw_belvedere_animation(scene: Rect2) -> void:
	for index in range(5):
		var x := scene.position.x + fmod(time * (12.0 + index) + index * 91.0, scene.size.x + 120.0) - 60.0
		var y := scene.position.y + 28.0 + index * 14.0
		draw_circle(Vector2(x,y), 16.0 + index * 2.0, Color(.92,.94,.91,.12))
	_draw_smoke(_scene_point(scene, .73, .39), scene.size.y * .28)

func _draw_finish_animation(scene: Rect2) -> void:
	# Luce calda pulsante nelle finestre della sauna e fumo dal suo camino.
	var glow_strength := .12 + (sin(time * 2.1) + 1.0) * .055
	draw_circle(_scene_point(scene, .815, .43), 18.0, Color(1.0,.59,.16,glow_strength))
	draw_circle(_scene_point(scene, .825, .43), 8.0, Color(1.0,.80,.34,glow_strength + .10))
	_draw_smoke(_scene_point(scene, .855, .27), scene.size.y * .34)
	for index in range(7):
		var y := scene.position.y + scene.size.y * (.55 + index * .045)
		var x := scene.position.x + scene.size.x * .55 + fmod(time * 16.0 + index * 31.0, scene.size.x * .42)
		draw_line(Vector2(x,y), Vector2(x + 19.0,y), Color(1.0,.78,.39,.22), 1.5, true)

func _draw_smoke(chimney: Vector2, max_rise: float) -> void:
	for index in range(9):
		var rise := fmod(time * 18.0 + index * 12.0, max_rise)
		var progress := rise / max_rise
		var smoke_center := chimney + Vector2(sin(time * .85 + index * 1.3) * (3.0 + progress * 10.0), -rise)
		draw_circle(smoke_center, 4.0 + progress * 9.0, Color(.95,.94,.87,.40 * (1.0 - progress)))

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
	var style := StyleBoxTexture.new()
	style.texture = load(MOCKUP_PANEL_FRAME)
	style.set_texture_margin(SIDE_LEFT, 72)
	style.set_texture_margin(SIDE_TOP, 86)
	style.set_texture_margin(SIDE_RIGHT, 72)
	style.set_texture_margin(SIDE_BOTTOM, 86)
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
