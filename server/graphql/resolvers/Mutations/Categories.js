import Categories from "../../../models/categories.js";

const existingCheck = async (name) => {
    if (name) {
        const existing = await Categories.findOne
        ({name: name})
        if (existing) {
            throw new Error("Category already exists");
        }
    }
}

const Mutations = {
    async addCategory(_, {name}) {
        console.log(name)
        await existingCheck(name)
        return await Categories.create({name});
    },

    async deleteCategory(_, {_id}) {
        return await Categories.findByIdAndDelete(_id);
    },
}
export default Mutations;
