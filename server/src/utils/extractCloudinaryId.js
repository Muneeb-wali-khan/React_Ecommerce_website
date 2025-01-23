
function extractId(url) {
    const avatar  = url?.split("/")
    const publicId = avatar[7]?.split('.')

    return publicId[0]
}

export {extractId}