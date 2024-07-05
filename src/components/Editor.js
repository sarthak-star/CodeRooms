import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Editor } from '@monaco-editor/react';
import LanguageSelector from './LanguageSelector';
import Output from './Output';
import { CODE_SNIPPETS } from '../constants';
import ACTIONS from '../actions';
import { executeCode } from '../api';

const CodeEditor = ({setLanguage, language, socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef();
    
    const [isLoading, setIsLoading] = useState(false);
    const [output, setOutput] = useState([]);
    const [isError, setIsError] = useState(false);
    const [userFontSize, setUserFontSize] = useState(16);
    const [userInput, setUserInput] = useState('');

    const onMount = useCallback((editor) => {
        editorRef.current = editor;
        editor.focus();

        editor.onDidChangeModelContent((event) => {
            const code = editor.getValue();
            onCodeChange(code);
            if (event.isFlush) return; // Ignore if the change event is from a setValue operation
            if (socketRef.current) {
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code,
                });
            }
        });
    }, [onCodeChange, roomId, socketRef]);

    const onSelect = (language) => {
        setLanguage(language);
        if (editorRef.current) {
            const code = CODE_SNIPPETS[language];
            editorRef.current.setValue(code);
            onCodeChange(code);
            if (socketRef.current) {
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code,
                });
                socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
                    roomId,
                    language,
                });
            }
        }
    };

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
            socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, ({ language }) => {
                setLanguage(language);
                if (editorRef.current) {
                    const code = CODE_SNIPPETS[language];
                    editorRef.current.setValue(code);
                }
            });
            socketRef.current.on(ACTIONS.OUTPUT_CHANGE, ({ output }) => {
                setOutput(output);
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
            socketRef.current.off(ACTIONS.LANGUAGE_CHANGE);
        };
    }, [socketRef,setLanguage]);

    const runCode = async () => {
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;

        try {
            setIsLoading(true);
            // Replace this with your actual code execution logic
            const { run: result } = await executeCode(language, sourceCode, userInput);
            setOutput(result.output.split("\n"));
            setIsError(!!result.stderr);

            // Emit output change event to synchronize across all clients
            if (socketRef.current) {
                socketRef.current.emit(ACTIONS.OUTPUT_CHANGE, {
                    roomId,
                    output: result.output.split("\n"),
                });
            }
        } catch (error) {
            console.log(error);
            alert("An error occurred: " + (error.message || "Unable to run code"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex flex-col h-screen space-y-4'>
            <div className='h-2/3' >
                <LanguageSelector runCode={runCode} userFontSize={userFontSize} setUserFontSize={setUserFontSize} language={language} onSelect={onSelect} />
                <div className="p-3 flex space-x-3">
                    <Editor
                        options={{
                            minimap: {
                                enabled: false,
                            },
                            fontSize: userFontSize
                        }}
                        height="55vh"
                        theme="vs-dark"
                        language={language}
                        defaultValue={CODE_SNIPPETS[language]}
                        onMount={onMount}
                        className=' rounded-2xl p-2 bg-[#1E1E1E]'
                    />
                    <div className='bg-slate-800 w-1/4 rounded-2xl p-2 text-slate-300 space-y-3' >
                        <h2 className='text-center' >Test Cases</h2>
                        <textarea placeholder='Enter STDIN //' className='bg-slate-800 text-slate-300 rounded-md w-full p-2 font-semibold text-lg' type="text" id="userInput" value={userInput} onChange={(e) => setUserInput(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className=' p-3'>
                <Output isLoading={isLoading} output={output} isError={isError} />

            </div>
        </div>
    );
};

export default CodeEditor;
