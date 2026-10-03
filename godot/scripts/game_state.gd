extends Node

const VERSION := "0.3.1"
const SAVE_PATH := "user://blisterborn-godot.json"
const PEOPLE := ["marco", "davide", "sara", "elena"]
const POI_NAMES := [
	"La Cascata di Lavvu", "La Sorgente Fredda", "Le Betulle dell’Alce",
	"La Costa dei Mirtilli", "La Baia del Pescatore", "Il Belvedere di Vuolle"
]

var player_name := ""
var person := "marco"
var poi := 0
var walking := false
var hour_minutes := 630
var energy := 100
var morale := 72
var holidays := 16
var money := 590
var gear := {
	"pack": "classico",
	"hat": "nessuno",
	"shoes": "trail",
	"net": false,
	"shell": false,
	"gloves": false,
	"poles": false,
}

func reset_trek() -> void:
	poi = 0
	walking = false
	hour_minutes = 630
	energy = 100
	morale = 72
	save_game()

func clock_text() -> String:
	return "%d:%02d" % [hour_minutes / 60, hour_minutes % 60]

func save_game() -> void:
	var payload := {
		"version": VERSION, "player_name": player_name, "person": person,
		"poi": poi, "hour_minutes": hour_minutes, "energy": energy,
		"morale": morale, "holidays": holidays, "money": money, "gear": gear,
	}
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(payload))

func load_game() -> bool:
	if not FileAccess.file_exists(SAVE_PATH):
		return false
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	var parsed = JSON.parse_string(file.get_as_text())
	if not parsed is Dictionary:
		return false
	player_name = str(parsed.get("player_name", ""))
	person = str(parsed.get("person", "marco"))
	poi = clampi(int(parsed.get("poi", 0)), 0, 5)
	hour_minutes = int(parsed.get("hour_minutes", 630))
	energy = int(parsed.get("energy", 100))
	morale = int(parsed.get("morale", 72))
	holidays = int(parsed.get("holidays", 16))
	money = int(parsed.get("money", 590))
	var stored_gear = parsed.get("gear", {})
	if stored_gear is Dictionary:
		for key in gear:
			if stored_gear.has(key): gear[key] = stored_gear[key]
	return true
