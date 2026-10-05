extends SceneTree

func _init() -> void:
	call_deferred("run")

func run() -> void:
	var state = root.get_node("GameState")
	assert(state.VERSION == "0.3.9")
	assert(state.POI_NAMES.size() == 6)
	state.person = "sara"
	state.gear.poles = true
	state.poi = 2
	var main = load("res://godot/scenes/main.tscn").instantiate()
	root.add_child(main)
	await process_frame
	assert(main.page != null)
	main.show_trail()
	await process_frame
	assert(main.trail != null)
	assert(main.trail.background != null)
	assert(main.trail.POI[0].background.contains("poi-t1-01-cascata-cutout.png"))
	assert(main.trail.POI[1].background.contains("poi-t1-02-sorgente-cutout-v2.png"))
	var backgrounds := {}
	for entry in main.trail.POI: backgrounds[entry.background] = true
	assert(backgrounds.size() == 6)
	assert(main.trail.drawer != null)
	assert(main.trail.stats_bar != null)
	assert(main.trail.POI[0].card.contains("assets/sprites/event"))
	assert(main.trail.get_node_or_null("CharacterPreview") == null)
	for poi in range(6):
		main.trail.configure(poi, poi % 2 == 0)
		assert(main.trail.background != null)
	print("Godot smoke test: 6 POI, carte illustrate e interfaccia senza vuoti OK")
	quit()
