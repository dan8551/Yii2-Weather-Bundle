<?php

namespace dan8551\components\weatherBundle;

use \yii\base\Widget;

class WeatherBundle extends Widget
{
    public $imageDir = '@vendor/dan8551/yii2-weather-bundle/assets/img';
    
    public $timeVal;

    /**
     * Overrides the parent function to load remote view into modal via Ajax.
     */
    public function run()
    {
	parent::run();
        $this->timeVal = Date("H:i:se");
	$this->registerAssets();
    }
    
    /**
     * Registers the needed assets
     */
    public function registerAssets()
    {
        $view = $this->getView();
        WeatherBundle::register($view);
        $uuid = uniqid();
        $js = <<<JS
            var weatherBundle = new WeatherBundle;
            weatherBundle.getWeather("{$this->imageDir}, {$this->timeVal}");
        JS;
        $view->registerJs($js,View::POS_READY);
    }
}
