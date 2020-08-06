<?php
	header('Content-Type: text/javascript');
	require_once('minify.php');

	$namespace = '';
	if(isset($_GET['namespace']) && $_GET['namespace'] != ''){
		$namespace = $_GET['namespace'];
		echo getJavascript($namespace);
	}else{
		echo '/* A namespace is required. */'; exit();
	}

	function getJavascript($ns){
		$class_dir = realpath(getcwd() . '/classes');
		if(isset($_GET['source']) && $_GET['source'] === 'true'){
			$enable_minify = FALSE;
		}
		else{
			$enable_minify = TRUE;
		}

		$output = '';

		$dir_handle = opendir($class_dir);
		while ($class_file = readdir($dir_handle)) {
			if($class_file !== '.' && $class_file !== '..' && $class_file !== $ns . '.js' && $class_file !== 'build.php' && $class_file !== 'minify.php'){
				$allow_this_file = TRUE;
				if($ns !== ''){
					if(beginsWith($class_file,$ns) || beginsWith($class_file,'@'.$ns)){
						$allow = TRUE;
					}
					else{
						$allow_this_file = FALSE;
					}
				}

				if($allow_this_file === TRUE){
					$class_content = file_get_contents($class_dir . '/' . $class_file);
				}

				$output .= '/*BEGIN: ' . $class_file . ' */' . "\n\n" . $class_content . "\n\n/*END: " . $class_file . " */\n\n";
			}
		}
		closedir($dir_handle);

		if($enable_minify === TRUE){
			$output = minifyJavascript($output);
		}

		return $output;
	}

	function minifyJavascript($original_js){
		$minified_js = JSMin::minify($original_js);
		return $minified_js;
	}


	function beginsWith($haystack, $needle) {
		return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
	}

?>