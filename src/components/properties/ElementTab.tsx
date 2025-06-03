import React from 'react';
import { useDiagramContext } from '../../context/DiagramContext';
import PropertySection from './PropertySection';
import SelectField from '../ui/SelectField';
import TextField from '../ui/TextField';

const ElementTab: React.FC = () => {
  const { selectedShape, updateSelectedShape } = useDiagramContext();
  
  if (!selectedShape) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Select an element to view its properties</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <PropertySection title="Labeling">
        <TextField
          label="ID Text"
          value={selectedShape.idText || ''}
          onChange={(value) => updateSelectedShape({ idText: value })}
        />
        
        <TextField
          label="Value"
          value={selectedShape.value || ''}
          onChange={(value) => updateSelectedShape({ value: value })}
        />
        
        <SelectField
          label="Inter"
          value={selectedShape.interLine || 'normal'}
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'loose', label: 'Loose' },
            { value: 'tight', label: 'Tight' },
          ]}
          onChange={(value) => updateSelectedShape({ interLine: value })}
        />
        
        <div className="flex space-x-3">
          <div className="flex-1">
            <SelectField
              label="Bold"
              value={selectedShape.fontWeight || 'normal'}
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'bold', label: 'Bold' },
              ]}
              onChange={(value) => updateSelectedShape({ fontWeight: value })}
            />
          </div>
          <div className="flex-1">
            <SelectField
              label="14"
              value={selectedShape.fontSize?.toString() || '14'}
              options={[
                { value: '10', label: '10' },
                { value: '12', label: '12' },
                { value: '14', label: '14' },
                { value: '16', label: '16' },
                { value: '18', label: '18' },
                { value: '20', label: '20' },
              ]}
              onChange={(value) => updateSelectedShape({ fontSize: parseInt(value) })}
            />
          </div>
        </div>
      </PropertySection>
      
      <PropertySection title="Description">
        <TextField
          label="Text Description"
          value={selectedShape.description || ''}
          onChange={(value) => updateSelectedShape({ description: value })}
          multiline
        />
        
        <SelectField
          label="Inter"
          value={selectedShape.descInterLine || 'normal'}
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'loose', label: 'Loose' },
            { value: 'tight', label: 'Tight' },
          ]}
          onChange={(value) => updateSelectedShape({ descInterLine: value })}
        />
        
        <div className="flex space-x-3">
          <div className="flex-1">
            <SelectField
              label="Bold"
              value={selectedShape.descFontWeight || 'normal'}
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'bold', label: 'Bold' },
              ]}
              onChange={(value) => updateSelectedShape({ descFontWeight: value })}
            />
          </div>
          <div className="flex-1">
            <SelectField
              label="14"
              value={selectedShape.descFontSize?.toString() || '14'}
              options={[
                { value: '10', label: '10' },
                { value: '12', label: '12' },
                { value: '14', label: '14' },
                { value: '16', label: '16' },
                { value: '18', label: '18' },
                { value: '20', label: '20' },
              ]}
              onChange={(value) => updateSelectedShape({ descFontSize: parseInt(value) })}
            />
          </div>
        </div>
      </PropertySection>
    </div>
  );
};

export default ElementTab;