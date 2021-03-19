const multer = require('multer');
const fs = require('fs');
const { common } = require('./../utilities/constants')
const thumb = require('node-thumbnail').thumb;
const compress_images = require('compress-images');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const S3= new AWS.S3({
    bucketName: 'hawilti-storage',
    dirName: 'hawilti-images', /* optional */
    region: 'eu-west-1',
    accessKeyId:'AKIASI6MPCRVQHZNJ2H6',
    secretAccessKey:'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'    
})


class uploadImage{
   
        constructor(){
            
        //  return{
        //     uploadFileMethod:this.uploadFileMethod.bind(this),
            
        // }
        }
         uploadFileMethod(folderName){
            this.folderName=folderName;
             console.log(folderName)
             let path=`${global.globalPath+'/uploads/'+this.folderName}`;
             let thumbnailimage=`${global.globalPath+'/uploads/'+this.folderName+common.thumbnailimage}`;
             let resizeimage=`${global.globalPath+'/uploads/'+this.folderName+common.resizeimage}`;
            //  console.log("asdad");
            //  console.log(path);
            if (!fs.existsSync(path)){
                        fs.mkdirSync(path);
                        fs.mkdirSync(thumbnailimage);
                        fs.mkdirSync(resizeimage);
             }
            
           let selt=this
            let storage =multer.diskStorage({
                destination: function (req, file, cb) {
                              
                cb(null, `./uploads/${selt.folderName}`)
                 },
                filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
                }
            })

           return multer({
            storage: storage,
            limits: { fileSize: 1024 * 1024 * 201 },
            fileFilter: function (req, file, cb) {
              
                if (file.mimetype == 'image/png' || file.mimetype == 'image/gif' || file.mimetype == 'application/svg' || file.mimetype == 'image/jpeg' || file.mimetype == 'video/quicktime' || file.mimetype=='video/avi' || file.mimetype=='video/x-flv' || file.mimetype=='video/mp4') {
                    return cb(null, true);
                } else {
                    cb(JSON.stringify({
                        code:500,
                        success: false,
                        message: 'Invalid file type. Only jpg, png , gif, jpeg, svg image  and quicktime, avi, flx, mp4 video files are allowed.'
                    }), false)
                }
            }
            })
     
        }

        //   imageresize(file, path, thumbnailimage, resizeimage){
        //     console.log("file");
        //     console.log(path);
        //     console.log(thumbnailimage);
        //     console.log(resizeimage);
        //     console.log(file);
        //     if (!fs.existsSync(path)){
        //         fs.mkdirSync(path);
        //         fs.mkdirSync(thumbnailimage);
        //         fs.mkdirSync(resizeimage);
        //     }
        //    let fileName= file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]
        //    console.log(fileName); 
        //   // return
        //     //let path=req.file.destination
        //     console.log("my Pa")
        //     console.log(path);
        //     let destination_path=path;
        //     let imagethumbnail_path=  thumbnailimage;
        //     let imageresize_path= resizeimage;
            
            
        // thumb({
        //     source: destination_path +'/'+ fileName,
        //     destination: imagethumbnail_path
        //   }).then(function() {
        //     compress_images(destination_path+'/'+fileName, imageresize_path, {compress_force: false, statistic: true, autoupdate: true}, false,
        //     {jpg: {engine: 'mozjpeg', command: ['-quality', '60']}},
        //     {png: {engine: 'pngquant', command: ['--quality=20-50']}},
        //     {svg: {engine: 'svgo', command: '--multipass'}},
        //     {gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}}, function(err, completed){
        //     if(completed === true){
        //     console.log("sucessfully devloped thumbnail and resize image");
        //     next();
        //     }else{
        //         console.log("something went wrong");
        //         }                                  
        //     });
        //     }).catch(function(e) {
        //     console.log('Error', e.toString());
        //   });
        //     return;

        // }
        
        awsFileUpload(){
            const awsStorage = multerS3({
                s3: S3,
                acl: 'public-read',
                bucket: 'hawilti-storage',
                key: function(req, file, cb) {
                  console.log("FIFIFIFIFFIFIFIFFIFIFIIFDATAA");
                  console.log(file);
                  cb(null, file.originalname+ '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
                }
              });
              
              return multer({
                storage: awsStorage,
                limits: { fileSize: 1024 * 1024 * 201 },
                fileFilter: function(req, file, cb) {
                    console.log("@2@@#######");
                    console.log(file);
                    if (file.mimetype == 'image/png' || file.mimetype == 'image/gif' || file.mimetype == 'application/svg' || file.mimetype == 'image/jpeg' || file.mimetype == 'video/quicktime' || file.mimetype=='video/avi' || file.mimetype=='video/x-flv' || file.mimetype=='video/mp4') {
                        return cb(null, true);
                    } else {
                        cb(JSON.stringify({
                            code:500,
                            success: false,
                            message: 'Invalid file type. Only jpg, png , gif, jpeg, svg image  and quicktime, avi, flx, mp4 video files are allowed.'
                        }), false)
                    }
                }
              });
        }
    }

module.exports=new uploadImage();