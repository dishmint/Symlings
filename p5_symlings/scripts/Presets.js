class Presets {
	constructor(props) {
		this.presets = []
		this.props = props
	}

	loadPresets(PArray) {
		PArray.map((p) => {
			this.addPreset(p)
		})
	}

	addPreset(preset) {
		let keys = Object.keys(preset)
		let hasValidKeys = this.props.every((prop) => {
			return keys.includes(prop)
		})

		if (hasValidKeys) {
			this.presets.push(preset)
		} else {
			console.log('preset contains invalid keys: ', keys)
		}
	}

	selectPreset(id) {
		return this.presets.find(x => x.id === id)
	}

}
