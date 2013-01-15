/**
 * New node file
 */
 $(document).ready(function(){
 	var detect_type = function(){
 		switch($('form [name="type"]').val()){
 			case 'transfer':
 				$('form [name="target"]').parent().show();
 				break;
 			default:
 				$('form [name="target"]').parent().hide();
 		}
 	};
 	var detect_floating = function(){
 		if($('#floating:checked').val()){
 			$('form [name="taken_date"]').parent().show(); 			
 		}else{
 			$('form [name="taken_date"]').parent().hide();
 		}
 	};
 	
 	$('form [name="type"]').change(detect_type);
 	$('#floating').change(detect_floating);
 	detect_type();
 	detect_floating();
 });