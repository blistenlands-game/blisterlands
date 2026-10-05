extends Control

const PAPER := Color("#eee2c8")
const PAPER_LIGHT := Color("#f6eedc")
const INK := Color("#302822")
const RUST := Color("#913711")
const SOFT := Color("#67594f")

var page: Control
var selected_person := "marco"
var name_edit: LineEdit
var trail: TrailView

func _ready() -> void:
	var web_query := str(JavaScriptBridge.eval("window.location.search")) if OS.has_feature("web") else ""
	if web_query.contains("preview=3d"):
		get_tree().change_scene_to_file.call_deferred("res://godot/scenes/diorama_3d.tscn")
		return
	var background := Control.new()
	background.set_script(load("res://godot/scripts/notebook_background.gd"))
	background.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(background)
	GameState.load_game()
	selected_person = GameState.person
	if web_query.contains("preview=finish"):
		GameState.player_name = "Nico"
		GameState.person = "marco"
		GameState.reset_trek()
		GameState.poi = 5
		GameState.hour_minutes = 988
		GameState.energy = 58
		GameState.morale = 45
		GameState.money = 640
		show_trail()
		trail.show_finish()
	elif web_query.contains("preview=trail"):
		GameState.player_name = "Nico"
		GameState.person = "marco"
		GameState.gear.poles = true
		GameState.reset_trek()
		show_trail()
	else:
		show_intro()

func clear_page() -> VBoxContainer:
	if page:
		remove_child(page)
		page.queue_free()
	var margin := MarginContainer.new()
	margin.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	margin.add_theme_constant_override("margin_left", 22)
	margin.add_theme_constant_override("margin_right", 18)
	margin.add_theme_constant_override("margin_top", 18)
	margin.add_theme_constant_override("margin_bottom", 18)
	add_child(margin)
	page = margin
	var column := VBoxContainer.new()
	column.add_theme_constant_override("separation", 10)
	margin.add_child(column)
	return column

func label(text: String, size_px := 18, color := INK) -> Label:
	var result := Label.new()
	result.text = text
	result.add_theme_font_size_override("font_size", size_px)
	result.add_theme_color_override("font_color", color)
	result.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	return result

func heading(text: String, size_px := 42) -> Label:
	var result := label(text, size_px, INK)
	var font := SystemFont.new()
	font.font_names = PackedStringArray(["Caveat", "Segoe Print", "Comic Sans MS"])
	font.font_weight = 700
	result.add_theme_font_override("font", font)
	return result

func panel_style(color := PAPER_LIGHT, border := INK, radius := 10) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = color
	style.border_color = border
	style.set_border_width_all(2)
	style.set_corner_radius_all(radius)
	style.content_margin_left = 12
	style.content_margin_right = 12
	style.content_margin_top = 8
	style.content_margin_bottom = 8
	return style

func button(text: String, primary := false) -> Button:
	var result := Button.new()
	result.text = text
	result.custom_minimum_size.y = 55
	result.add_theme_font_size_override("font_size", 22)
	result.add_theme_color_override("font_color", Color.WHITE if primary else INK)
	result.add_theme_stylebox_override("normal", panel_style(RUST if primary else PAPER_LIGHT, RUST if primary else INK, 9))
	result.add_theme_stylebox_override("hover", panel_style(RUST.lightened(.08) if primary else Color("#fff8e8"), RUST if primary else INK, 9))
	result.add_theme_stylebox_override("pressed", panel_style(RUST.darkened(.08) if primary else Color("#e8ddc5"), RUST if primary else INK, 9))
	return result

func show_intro() -> void:
	var column := clear_page()
	column.add_child(heading("Blisterborn", 55))
	column.add_child(label("Prototipo Godot · versione %s" % GameState.VERSION, 16, SOFT))
	column.add_child(label("Hai un lavoro, uno stipendio e un sogno: la Via delle Renne, in Lapponia.", 20))
	column.add_child(heading("Chi sei?", 34))
	var grid := GridContainer.new()
	grid.columns = 2
	grid.add_theme_constant_override("h_separation", 10)
	grid.add_theme_constant_override("v_separation", 10)
	for person in GameState.PEOPLE:
		var portrait := TextureButton.new()
		portrait.texture_normal = load("res://assets/sprites/portrait/%s.png" % person)
		portrait.ignore_texture_size = true
		portrait.stretch_mode = TextureButton.STRETCH_KEEP_ASPECT_CENTERED
		portrait.custom_minimum_size = Vector2(165, 145)
		portrait.tooltip_text = "Scegli questo aspetto"
		portrait.modulate = Color.WHITE if person == selected_person else Color(.72,.72,.72,1)
		portrait.pressed.connect(func(): selected_person = person; show_intro())
		grid.add_child(portrait)
	column.add_child(grid)
	column.add_child(label("Come ti chiamano lungo il cammino?", 19))
	name_edit = LineEdit.new()
	name_edit.text = GameState.player_name
	name_edit.placeholder_text = "Scrivi il nome"
	name_edit.custom_minimum_size.y = 48
	name_edit.add_theme_font_size_override("font_size", 20)
	name_edit.add_theme_stylebox_override("normal", panel_style(PAPER_LIGHT, INK, 5))
	column.add_child(name_edit)
	var start := button("Prepara lo zaino", true)
	start.pressed.connect(_start_pressed)
	column.add_child(start)

func _start_pressed() -> void:
	var chosen_name := name_edit.text.strip_edges()
	if chosen_name.is_empty():
		name_edit.placeholder_text = "Prima scrivi il nome"
		name_edit.grab_focus()
		return
	GameState.player_name = chosen_name
	GameState.person = selected_person
	GameState.save_game()
	show_pack()

func show_pack() -> void:
	var column := clear_page()
	column.add_child(heading("Prepara lo zaino", 40))
	column.add_child(label("Queste scelte sono già salvate nel nuovo stato di gioco. Il personaggio usa soltanto animazioni complete: nessun accessorio viene appoggiato sopra.", 16, SOFT))
	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	var fields := VBoxContainer.new()
	fields.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	fields.add_theme_constant_override("separation", 8)
	scroll.add_child(fields)
	column.add_child(scroll)
	add_choice(fields, "Zaino", ["classico", "ultralight"], "pack")
	add_choice(fields, "Copricapo", ["nessuno", "lana verde", "cappello da sole"], "hat")
	add_choice(fields, "Scarpe", ["trail", "basse", "scarponi"], "shoes")
	add_toggle(fields, "Rete antizanzare", "net")
	add_toggle(fields, "Guscio", "shell")
	add_toggle(fields, "Guanti neri", "gloves")
	add_toggle(fields, "Bastoncini", "poles")
	var start := button("Parti per la tappa 1", true)
	start.pressed.connect(func(): GameState.reset_trek(); show_trail())
	column.add_child(start)
	var back := button("← Torna alla scelta del personaggio")
	back.pressed.connect(show_intro)
	column.add_child(back)

func add_choice(parent: VBoxContainer, title: String, options: Array, key: String) -> void:
	var row := HBoxContainer.new()
	row.add_child(label(title, 18))
	var choice := OptionButton.new()
	choice.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	for option in options: choice.add_item(option.capitalize())
	choice.select(maxi(0, options.find(str(GameState.gear[key]))))
	choice.item_selected.connect(func(index: int): GameState.gear[key] = options[index]; GameState.save_game())
	row.add_child(choice)
	parent.add_child(row)

func add_toggle(parent: VBoxContainer, title: String, key: String) -> void:
	var toggle := CheckButton.new()
	toggle.text = title
	toggle.button_pressed = bool(GameState.gear[key])
	toggle.add_theme_font_size_override("font_size", 18)
	toggle.toggled.connect(func(value: bool): GameState.gear[key] = value; GameState.save_game())
	parent.add_child(toggle)

func show_trail() -> void:
	if page:
		remove_child(page)
		page.queue_free()
	var full := Control.new()
	full.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(full)
	page = full
	trail = TrailView.new()
	trail.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	full.add_child(trail)
	trail.choice_selected.connect(_trail_choice)
	trail.pack_requested.connect(show_pack)
	trail.restart_requested.connect(func(): GameState.reset_trek(); show_trail())
	trail.configure(GameState.poi, GameState.walking)

func progress_dots() -> String:
	var result := ""
	for index in range(6): result += "●" if index <= GameState.poi else "○"
	return result

func ambient_description(index: int) -> String:
	return [
		"Acqua e spruzzi attraversano davvero il paesaggio.",
		"La sorgente respira in cerchi concentrici.",
		"Le foglie passano fra i tronchi delle betulle.",
		"Piccoli riflessi si accendono fra i mirtilli.",
		"Il lago si muove e gli uccelli tagliano il cielo.",
		"Le nuvole scorrono sopra il belvedere di Vuolle.",
	][index]

func _trail_choice(choice: Dictionary) -> void:
	if GameState.walking: return
	GameState.walking = true
	GameState.energy = clampi(GameState.energy + int(choice.get("energy", 0)), 0, 100)
	GameState.morale = clampi(GameState.morale + int(choice.get("morale", 0)), 0, 100)
	GameState.money = maxi(0, GameState.money + int(choice.get("money", 0)))
	GameState.hour_minutes += int(choice.get("minutes", 0))
	trail.set_walking(true)
	await get_tree().create_timer(6.4).timeout
	GameState.walking = false
	GameState.hour_minutes += 45
	GameState.energy = maxi(0, GameState.energy - 7)
	if GameState.poi >= 5:
		GameState.save_game()
		trail.show_finish()
		return
	GameState.poi += 1
	GameState.save_game()
	trail.configure(GameState.poi, false)
