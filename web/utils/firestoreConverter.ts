
export const Converter = {
    toFirestore: (post) => ({...post}), fromFirestore: (snapshot, options) => ({
        id: snapshot.id,
        ref: snapshot.ref,
        ...(snapshot.data(options))
    })
}
export default Converter;