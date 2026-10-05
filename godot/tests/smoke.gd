extends SceneTree

func _init() -> void:
	call_deferred("run")

func run() -> void:
	var state = root.get_node("GameState")
	assert(state.VERSION == "0.3.4")
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
	assert(main.trail.BACKGROUNDS[0].contains("assets/godot/poi-t1-waterfall-v1.png"))
	assert(main.trail.hiker.texture.resource_path.contains("walk-poles/sara.png"))
	assert(main.trail.hiker.mirrored)
	assert(main.trail.hiker.size.x == main.trail.hiker.size.y)
	for poi in range(6):
		main.trail.configure(poi, poi % 2 == 0)
		assert(main.trail.background != null)
	print("Godot smoke test: intro, equipaggiamento, 6 POI, mappa e animazioni complete OK")
	quit()
