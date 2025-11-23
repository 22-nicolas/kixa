

export default function Item({ itemData }) {

    const {id, name, price, colors, brand, sizes, description, variants} = itemData

    const shoeAssetsPath = "public/shoes"

    const colorways = Array.from({ length: variants }).map((_, i) => 
    <div key={i} className="color-way" data-color={i}>
        <img src={`${shoeAssetsPath}/${id}/${id}_${i+1}_1.png`}/>
    </div>)

    return(
        <div className="item" id={id}>
            <div className="href">
                <div className="img-container">
                    <img className="item-img" src={`${shoeAssetsPath}/${id}/${id}_1_1.png`}/>
                </div>
                <p className="name">{name}</p>
                <p className="price">{price}$</p>
            </div>
            <div className="color-ways">
                 {colorways}
            </div>
        </div>
    )
}