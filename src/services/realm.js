import Realm from "realm";

export const getRealm = async () => {
	return await Realm.open({
		path: 'juiceApp',
		schema: [Essence, Brand, Suplier, Recipe, Config, RecipeProduced],
		schemaVersion: 27
	})
}

export const Recipe = {
	name: "Recipe",
	primaryKey: "_id",
	properties: {
		_id: "string",
		name: 'string',
		vg: "int",
		pg: "int",
		createdAt: 'date',
		essences: 'Essence[]',
		percents: 'double[]',
		essencePg: 'Essence',
		essenceVg: 'Essence'
	}
}

export const RecipeProduced = {
	name: "RecipeProduced",
	primaryKey: "_id",
	properties: {
		_id: "string",
		recipe: 'Recipe',
		createdAt: 'date',
		months: 'int',
		breath: 'int',
		rating: 'int',
		quantity: 'double'
	}
}

export const Essence = {
	name: "Essence",
	primaryKey: "_id",
	properties: {
		_id: "string",
		name: "string",
		brand: "Brand",
		taste: 'string?',
		quantity: 'double',
		price: 'double',
		suplier: 'Suplier?',
		isEssence: 'bool'
	}
}

export const Brand = {
	name: "Brand",
	primaryKey: "_id",
	properties: {
		_id: "string",
		name: "string"
	}
}

export const Suplier = {
	name: "Suplier",
	primaryKey: "_id",
	properties: {
		_id: "string",
		name: "string"
	},
}

export const Config = {
	name: "Config",
	primaryKey: "_id",
	properties: {
		_id: "string",
		pgDefault: 'double',
		vgDefault: 'double',
		stepDefault: 'int'

	},
}

