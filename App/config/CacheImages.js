import React , { useState, useEffect } from 'react'
import { Image } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'

export default function CacheImage ({url, name, style}) {
    
    const [source, setSource] = useState('')

    useEffect(() => {
        const { fs } = RNFetchBlob;
        let Cache = fs.dirs.DownloadDir + "/LibAud/Cache/";
        RNFetchBlob.fs.exists(Cache + name)
            .then((exist) => {
                console.log("does the file exists ? : " + exist)
                if (!exist) {
                    const { config, fs } = RNFetchBlob;
                    let LibAudDir = fs.dirs.DownloadDir + "/LibAud/Cache/";
                    let options = {
                        fileCache: true,
                        path: LibAudDir + name,
                    };
                    config(options)
                        .fetch('GET', url)
                        .then(res => {
                            if (res.data) {
                                console.log(res.path())
                                setSource({ uri: 'file://'+res.path()})
                            } else {
                                alert(('Cache Failed'));
                            }
                        });
                } else {
                    // if exists we disply the image from the storage
                    setSource({ uri: 'file://' + Cache + name})
                }
            })
            .catch((err) => { console.log(err) })
        },[])
        // console.log(source)
        return (
            <Image style={style} source={source} />
        )
}