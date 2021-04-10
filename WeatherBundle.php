<?php

namespace dan8551\components\weatherBundle;

use yii\bootstrap4\Html;
use yii\web\View;
use \yii\base\Widget;
use Yii;
use rmrevin\yii\fontawesome\FAS;

class WeatherBundle extends Widget
{
    public $imageDir = '@vendor/dan8551/yii2-weather-bundle/assets/img';
    
    public $timestamp = '';
    
    public $lat;
    
    public $lon;
    
    public $weatherUrl = '';
    
    public $droneModels;
    
    private $timeVal;

    /**
     * Overrides the parent function to load remote view into modal via Ajax.
     */
    public function run()
    {
	parent::run();
        $this->imageDir = Yii::$app->assetManager->publish($this->imageDir)[1];
        $this->timeVal = Date("H:i:se", $this->timestamp);
	$this->registerAssets();
        return $this->renderView();
    }
    
    /**
     * Registers the needed assets
     */
    public function registerAssets()
    {
        $jsTimeVal = Date('l d/m/Y H:i', $this->timestamp);
        $view = $this->getView();
        WeatherBundleAsset::register($view);
        $uuid = uniqid();
        $js = <<<JS
            var wb = new WeatherBundle({$this->lat}, {$this->lon}, '{$this->weatherUrl}', 'metric', {$this->droneModels}, '{$jsTimeVal}');
            wb.getWeather("{$this->imageDir}", "{$this->timeVal}");
        JS;
        $view->registerJs($js,View::POS_READY);
    }
    
    /**
     * Gets the icon represented by "icon" name
     * 
     * @param string $icon
     * @param bool $animated 
     */
    public function getIcon($icon, $animated = false)
    {
        $imageDir = $animated ? 'animated' : 'static';
        return "{$this->imageDir}/{$imageDir}/{$icon}";
    }
    
    public function renderRow($itemArray = [])
    {
        $items = '';
        foreach($itemArray as $item)
        {
            if(array_key_exists('class', $item))
                $class= "class='{$item['class']}'";
            $itemFunction = 'render'. ucfirst($item[0]);
            $items .= "{$this->$itemFunction()}";
        }
        $row = "<div class='row'>{$items}</div>";
        return $row;
    }
    
    public function renderHeader()
    {
        $content = Html::tag('h2', 'Not Good To Fly', ['style' => 'margin: 0px; margin-top: 10px;']);
//        $content .= Html::tag('p', date('l d/m/Y H:i').' GMT');
        $col = Html::tag('div',$content,['class' => 'col-md-12 weatherBox', 'id'=> 'goodToFly']);
        return $col;
    }
    
    public function renderWeather()
    {
        $content = Html::tag('p', 'Weather');
        $col = Html::tag('div', $content, ['class' => 'col-md-4 weatherBox border border-dark', 'id' => 'weather']);
        return $col;
    }
    
    public function renderTimeOfDay()
    {
        $sunUpIcon = Html::img($this->getIcon('day.svg', true), ['height' => '30']);
        $sunDownIcon = Html::img($this->getIcon('night.svg', true), ['height' => '30']);
        $content = Html::tag('p', 'Time Of Day');
        $content .= Html::tag('p', $sunUpIcon . FAS::icon('long-arrow-alt-up'), ['id' => 'sunUp']);
        $content .= Html::tag('p', $sunDownIcon . FAS::icon('long-arrow-alt-down'), ['id' => 'sunDown']);
        return Html::tag('div', $content, ['class' => 'col-md-4 weatherBox border border-dark', 'id' => 'TOD']);
    }
    
    public function renderTemperature()
    {
        $content = Html::tag('p', 'Temperature');
        return Html::tag('div', $content, ['class' => 'col-md-4 weatherBox border border-dark', 'id' => 'temperature']);
    }
    
    public function renderWind()
    {
        $content = Html::tag('p', 'Wind');
        return Html::tag('div', $content, ['class' => 'col-md-4 weatherBox border border-dark', 'id' => 'wind']);
    }
    
    public function renderGusts()
    {
        $content = Html::tag('p', 'Gusts');
        return Html::tag('div', $content, ['class' => 'col-md-4 weatherBox border border-dark', 'id' => 'gusts']);
    }
    
    public function renderWindDir()
    {
        $content = Html::tag('p', 'Wind Dir.');
        return Html::tag('div', $content, ['class' => 'col-md-4 weatherBox border border-dark', 'id' => 'windDir']);
    }
    
    public function renderPrecipitation()
    {
        $content = Html::tag('p', 'Precipitation');
        return Html::tag('div', $content, ['class' => 'col-md-4 weatherBox border border-dark', 'id' => 'precipitation']);
    }
    
    public function renderClouds()
    {
        $content = Html::tag('p', 'Cloud Cover');
        return Html::tag('div', $content, ['class' => 'col-md-4 weatherBox border border-dark', 'id' => 'clouds']);
    }
    
    public function renderVisibility()
    {
        $content = Html::tag('p', 'Visibility');
        return Html::tag('div', $content, ['class' => 'col-md-4 weatherBox border border-dark', 'id' => 'visibility']);
    }
    
    public function renderView()
    {
        $retStr = '';
        $retStr .= $this->renderRow([
            [
                'header',
                'class' => ""
            ]
        ]);
        $retStr .= $this->renderRow([
            [
                'weather',
                'class' => "col-md-4 weatherBox border border-dark",
            ],
            [
                'timeOfDay', 
                'class' => "col-md-4 weatherBox border border-dark",
            ],
            [
                'temperature',
                'class' => "col-md-4 weatherBox border border-dark",
            ]
        ]);
        $retStr .= $this->renderRow([
            [
                'wind',
                'class' => "col-md-4 weatherBox border border-dark",
            ],
            [
                'gusts', 
                'class' => "col-md-4 weatherBox border border-dark",
            ],
            [
                'windDir',
                'class' => "col-md-4 weatherBox border border-dark",
            ]
        ]);
        $retStr .= $this->renderRow([
            [
                'precipitation',
                'class' => "col-md-4 weatherBox border border-dark",
            ],
            [
                'clouds', 
                'class' => "col-md-4 weatherBox border border-dark",
            ],
            [
                'visibility',
                'class' => "col-md-4 weatherBox border border-dark",
            ]
        ]);
        return $retStr;
    }
}

?>
