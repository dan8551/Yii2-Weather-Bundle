<?php

namespace dan8551\components\weatherBundle;

use Yii;
use yii\web\AssetBundle;

class WeatherBundleAsset extends AssetBundle
{
     public $sourcePath = '@vendor/dan8551/yii2-weather-bundle/assets';

    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap4\BootstrapAsset',
        'yii\bootstrap4\BootstrapPluginAsset',
        'yii\web\JqueryAsset',
    ];
   
   public $css = [
	'css/weather-bundle.css'
   ];
    
    public $js = [
        'js/weather-bundle.js',
    ];


}
